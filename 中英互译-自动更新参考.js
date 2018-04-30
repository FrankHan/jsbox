/**
 * @Version 1.4
 * @author Liu Guo
 * @date 2018.4.15
 * @brief 
 *   1. 优化发音功能
 *   2. 新增翻译结果复制功能
 *   3. 其他若干优化
 * @/brief
 */

"use strict"

let appVersion = 1.4
let addinURL = "https://gist.githubusercontent.com/LiuGuoGY/ec3918f9f68952b4f3aea78b5c9eb926/raw"

if (needCheckup()) {
  checkupVersion()
} else {
  translate()
}

function translate() {
  let text = $clipboard.text
  if (text == undefined || text == "") {
    $ui.alert("剪切板为空")
  } else {
    let newText = preprocess(text)
    $ui.loading("翻译中")
    bingTran(newText)
  }
}

function preprocess(txt) {
  let newText = txt
  if (whichLan(txt) == "en") {
    newText = txt.replace(/-\n/g, "")
  }
  myLog(newText)
  return newText
}

//必应翻译
function bingTran(text) {
  let url = "http://xtk.azurewebsites.net/BingDictService.aspx?Word=" + text + "&Samples=false"
  let codeUrl = encodeURI(url)
  $http.request({
    method: "GET",
    url: codeUrl,
    timeout: 5,
    showsProgress: false,
    handler: function(resp) {
      $console.info(resp.data)
      if (resp.error != null) {
        $ui.loading(false)
        $ui.alert("网络开小差了")
      } else if (!resp.data.hasOwnProperty("defs")) {
        if (resp.data.indexOf("An error occurs") >= 0) {
          googleTran(text)
        } else {
          kingsoftTran(text)
        }
      } else if (resp.data.defs == null) {
        googleTran(text)
      } else {
        $ui.loading(false)
        analyseBData(resp.data)
      }
    }
  })
}

//谷歌翻译
function googleTran(text) {
  let tl = whichLan(text)
  if (tl == "en") {
    tl = "zh-CN"
  } else {
    tl = "en"
  }
  myLog(tl)
  $http.request({
    method: "POST",
    url: "http://translate.google.cn/translate_a/single",
    timeout: 5,
    header: {
      "User-Agent": "iOSTranslate",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: {
      "dt": "t",
      "q": text,
      "tl": tl,
      "ie": "UTF-8",
      "sl": "auto",
      "client": "ia",
      "dj": "1"
    },
    showsProgress: false,
    handler: function(resp) {
      $ui.loading(false)
      myLog(resp.data)
      analyseGData(resp.data)
    }
  })
}

//金山词霸
function kingsoftTran(text) {
  let url = "http://dict-mobile.iciba.com/interface/index.php?c=word&m=getsuggest&nums=1&client=6&is_need_mean=1&word=" + text
  let codeUrl = encodeURI(url)
  $http.get({
    url: codeUrl,
    timeout: 5,
    showsProgress: false,
    handler: function(resp) {
      let data = resp.data
      myLog(data)
      if (data.status == 1) {
        $ui.loading(false)
        analyseKData(data)
      } else {
        googleTran(text)
      }
    }
  })
}

//分析谷歌数据
function analyseGData(data) {
  let length = data.sentences.length
  let meanText = "▫️"
  let meanTitle = ""
  for (let i = 0; i < length; i++) {
    meanText += data.sentences[i].trans
    if (i < length - 1) {
      meanText += "\n"
    }
    meanTitle += data.sentences[i].orig
  }

  showResult(meanTitle, meanText)
}

//分析必应数据
function analyseBData(data) {
  let length = data.defs.length
  let meanText = ""
  for (let i = 0; i < length; i++) {
    meanText += data.defs[i].pos
    meanText += "▫️"
    meanText += data.defs[i].def
    meanText += ";"
    if (i < length - 1) {
      meanText += "\n"
    }
  }
  showResult(data.word, meanText)
}

//分析金山数据
function analyseKData(data) {
  let mess = data.message[0]
  let length = mess.means.length
  let meanText = ""
  for (let i = 0; i < length; i++) {
    meanText += mess.means[i].part
    meanText += "▫️"
    let meansLength = mess.means[i].means.length
    for (let j = 0; j < meansLength; j++) {
      meanText += mess.means[i].means[j]
      meanText += "; "
    }
    meanText += ";"
  }
  showResult(mess.key, meanText)
}

//展示翻译结果
function showResult(title, msg) {
  $ui.alert({
    title: title,
    message: msg,
    actions: [{
        title: "OK",
        handler: function() {
          if ($app.env != $env.app) {
            $app.close(2)
          }
        }
      },
      {
        title: "MORE",
        handler: function() {
          showMore(chooseEn(title, msg))
        }
      }
    ]
  })
}

function showMore(text) {
  $ui.menu({
    items: ["COPY", "SPEECH"],
    handler: function(title, idx) {
      switch (idx) {
        case 0:
          copy(text)
          break;
        case 1:
          speechText(text)
          break;
        default:
          break;
      }
    },
    finished: function(cancelled) {
      if ($app.env != $env.app) {
        $app.close(2)
      }
    }
  })
}

//需要更新？
function needUpdate(nv, lv) {
  let m = parseFloat(nv) - parseFloat(lv)
  if (m < 0) {
    return true
  } else {
    return false
  }
}

//升级插件
function updateAddin() {
  let url2i = encodeURI("jsbox://install?url=" + addinURL + "&name=" + currentName() + "&icon=" + currentIcon())
  $app.openURL(url2i)
}

//检查版本
function checkupVersion() {
  $ui.loading("检查更新")
  $http.download({
    url: addinURL,
    showsProgress: false,
    timeout: 5,
    handler: function(resp) {
      $console.info(resp)
      let str = resp.data.string
      $console.info(str)
      let lv = getVFS(str)
      $ui.loading(false)
      if (needUpdate(appVersion, lv)) {
        sureToUpdate(str)
      } else {
        translate()
      }
    }
  })
}

//获取版本号
function getVFS(str) {
  let vIndex = str.indexOf("@Version ")
  let start = vIndex + 9
  let end = start + 3
  let lv = str.substring(start, end)
  return lv
}

//获取更新说明
function getUpDes(str) {
  let bIndex = str.indexOf("@brief")
  let eIndex = str.indexOf("@/brief")
  let des = str.substring(bIndex + 6, eIndex)
  let fixDes = des.replace(/\*/g, "")
  myLog(fixDes)
  return fixDes
}

//当前插件名
function currentName() {
  let name = $addin.current.name
  let end = name.length - 3
  return name.substring(0, end)
}

//当前插件图标
function currentIcon() {
  return $addin.current.icon
}

//确定升级？
function sureToUpdate(str) {
  let des = getUpDes(str)
  $ui.alert({
    title: "发现新版本",
    message: des + "\n是否更新？",
    actions: [{
        title: "是",
        handler: function() {
          updateAddin()
        }
      },
      {
        title: "否",
        handler: function() {

        }
      }
    ]
  })
}

//需要检查更新？
function needCheckup() {
  let nDate = new Date()
  let lastCT = $cache.get("lastCT")
  if (lastCT == undefined) {
    $cache.set("lastCT", nDate)
    return true
  } else {
    let tdoa = (nDate.getTime() - lastCT.getTime()) / (60 * 1000)
    let interval = 1440
    if ($app.env == $env.app) {
      interval = 15
    }
    myLog("离下次检测更新: " + (interval - tdoa) + "  分钟")
    if (tdoa > interval) {
      $cache.set("lastCT", nDate)
      return true
    } else {
      return false
    }
  }
}

//判断语言
function whichLan(text) {
  let patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi
  let tl = "en"
  if (patrn.exec(text)) {
    tl = "zh-CN"
  } else {
    tl = "en"
  }
  return tl
}

//TTS
function speechText(text) {
  let newText = text.replace(/.*.*.*▫️/g, "")
  myLog(newText)
  let lan = whichLan(newText)
  if (lan == "en") {
    lan = "en-US"
  }
  $text.speech({
    text: newText,
    rate: 0.4,
    language: lan,
  })
}

//myLog
function myLog(text) {
  if ($app.env == $env.app) {
    $console.log(text)
  }
}

//选择英文的一项
function chooseEn(t1, t2) {
  let lan = "en"
  let text = t2
  if (whichLan(t1) == "en") {
    text = t1
  }
  return text
}

//复制到剪贴板
function copy(text) {
  let newText = text.replace(/.*.*.*▫️/g, "")
  $clipboard.text = newText
  $delay(0.1, function() {
    $ui.toast("已复制到剪切板", 1)
  })
}