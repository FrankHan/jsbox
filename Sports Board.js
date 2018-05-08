/**
 * @Version 2.9
 * @author QvQ
 * @date 2018.5.7
 * @brief 
 *   1. 增加了世界杯的比赛
 * @/brief
 */

// 感谢Ablecats和Fndroid的帮助，特此致谢

// $app.tips("点击比赛即可查看详情");

"use strict"

// ----版本自动更新
let appVersion = 2.9
let addinURL = "https://raw.githubusercontent.com/FrankHan/jsbox/master/Sports%20Board.js"

// 初始时获取上次筛选的比赛
let lastChoice_Sport = $cache.get("lastChoice_Sport")
if (lastChoice_Sport == undefined) { //上次没有筛选
  getDatabyGametype("nba") //获取nba
  return true
} else {
  getDatabyGametype(lastChoice_Sport)//获取上次的比赛
}



function getDatabyGametype(gametype) {

  var httpUrl = "https://games.mobileapi.hupu.com/3/7.1.18/" + gametype + "/getGames?time_zone=Asia%2FShanghai&direc=next&client=cbf23a9fe5297e062f92690a7ed26af3c6647078&night=0&crt=1525160359&advId=68388FF5-D314-42F2-9B5B-B66FC782C857&clientId=35294508&sign=1801bb7c73ba11266d2db1ec1bbb37db&preload=0"


  if (gametype == "csl1" || gametype == "csl2" || gametype == "csl3") {//中国足球的比赛：csl
    var httpUrl = "https://games.mobileapi.hupu.com/3/7.1.18/" + "csl" + "/getGames?time_zone=Asia%2FShanghai&direc=next&client=cbf23a9fe5297e062f92690a7ed26af3c6647078&night=0&crt=1525160359&advId=68388FF5-D314-42F2-9B5B-B66FC782C857&clientId=35294508&sign=1801bb7c73ba11266d2db1ec1bbb37db&preload=0"
  }

  var resp = []
  $http.get({
    url: httpUrl,
    header: {
      "Accept-Encoding": "gzip",
      "Connection": "keep-alive",
      "Cookie": "cpck=eyJwcm9qZWN0SWQiOiIzIiwiY2xpZW50IjoiY2JmMjNhOWZlNTI5N2UwNjJmOTI2OTBhN2VkMjZhZjNjNjY0NzA3OCIsImlkZmEiOiI2ODM4OEZGNS1EMzE0LTQyRjItOUI1Qi1CNjZGQzc4MkM4NTcifQ==; __dacevid3=0x77ff9195c945e6ea; cid=35294508",
      "Host": "games.mobileapi.hupu.com",
      "Proxy-Connection": "keep-alive",
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Mobile/14G60 isp/460.02 network/WIFI prokanqiu/7.1.18.55 iPhone8,4"
    },
    handler: function (resp) {

      $ui.loading(false);//切换比赛成功，隐藏加载中按钮

      render(resp)

    }
  })

  // Main program
  function render(resp) {
    var data = resp.data

    // console.log(data)  // 可以用于显示所有resp
    var currentDate = data.result.days.current; //20180501

    var arrDayForScrollLocation_section = []

    // $ui.alert(currentDate)

    // var rowsData = []; //列表信息
    var gamesList = data.result.games;

    //  var dateblockForSectionTitle = gamesList[0].date_block;
    // $ui.alert(date_block)

    var gamesListIndex = [];
    var gameDataArr = []; //具体数据值

    for (var key in gamesList) {
      gamesListIndex.push(key); // 输出数组下标 0,1,...

      gameDataArr.push(gamesList[key]);
    }



    // ----！！！ 给rowToDayList赋值
    var rowToDayList = []; //每行比赛数据,用于最终传给list显示！


    var nowTimestamp = new Date().getTime();


    for (var kk = 0; kk < gameDataArr.length; kk++) { //games[0],games[1]就是不同天

      var toDayList = gameDataArr[kk].data; //当天比赛数据
      // var dayForScrollLocation = gameDataArr[kk].day;//20180507

      // var dayForScrollLocation_section = kk;

      // if (dayForScrollLocation >= currentDate) {

      //   arrDayForScrollLocation_section.push(dayForScrollLocation_section)

      // }

      var dateblockForSectionTitle = gamesList[kk].date_block;


      var objOneDay_Rows = [];


      var elementOneDay = { //这必须是一个obj element好像
        title: dateblockForSectionTitle,
        rows: objOneDay_Rows
      };

      for (var i = 0; i < toDayList.length; i++) { // 当天的第0,1,2场比赛

        var obj = {};

        obj.teams = {};
        obj.content = {};

        obj.onewinscore = {};
        obj.twowinscore = {};
        obj.scheduleid = {};
        obj.isOver = {}; //是否正在进行中
        //obj.oneicon = {}; //一队图标
        //obj.twoicon = {}; //二队图标

        if (toDayList[i].home_name == "精彩瞬间" || toDayList[i].home_name == "疯狂竞猜" || toDayList[i].away_name == "路人王" || toDayList[i].home_name == "虎扑" || toDayList[i].away_name == "抽签仪式") {

          // console.log("非比赛，无关的")

        } else {//不是广告
          obj.teams.text = toDayList[i].home_name + " : " + toDayList[i].away_name;
          obj.onewinscore.text = toDayList[i].home_score.toString();
          obj.twowinscore.text = toDayList[i].away_score.toString();
          obj.matchdateInFinalData = gameDataArr[kk].day;//20180507

          // 未开始的比赛去除比分
          obj.matchTime = toDayList[i].begin_time;
          if (obj.matchTime > nowTimestamp / 1000) {//还没开始的比赛
            obj.onewinscore.text = "";
            obj.twowinscore.text = "";
          }



          obj.gidUrl = toDayList[i].gid.toString();

          switch (gametype) {
            case "nba":
              obj.isOver.text = toDayList[i].process;
              var nbaMatchtype = toDayList[i].match_type;
              switch (nbaMatchtype) {
                case "PLAYOFF":
                  obj.content.text = "NBA季后赛";
                  break;
                case "SEASON":
                  obj.content.text = "NBA常规赛";
                  break;
                default:
                  obj.content.text = "NBA";
                  break;
              }

              break;
            case "chlg": case "liga": case "epl": case "bund": case "csl1": case "csl2": case "csl3": case "seri":  case "worldcup":  
              obj.isOver.text = toDayList[i].status.desc;// + toDayList[i].stadium_name_en; //球场
              obj.content.text = toDayList[i].type_block;
              break;


          }


          var matchtypeTemp = toDayList[i].type_block;
          var matchtypeTemp = matchtypeTemp.substr(0, 2);
          // console.log(matchtypeTemp)



          // 这一段：问题：造成定位到今天有问题
          switch (gametype) {
            case "csl1"://为中超，不push中甲、亚冠、足协比赛
              if (matchtypeTemp == "中甲" || matchtypeTemp == "足协" || matchtypeTemp == "亚冠") {
                //不push
              } else {
                objOneDay_Rows.push(obj);
              }
              break;
            case "csl2"://为亚冠
              if (matchtypeTemp == "中超" || matchtypeTemp == "足协" || matchtypeTemp == "中甲") {
                //不push
              } else {
                objOneDay_Rows.push(obj);
              }
              break;
            case "csl3"://为中甲 足协
              if (matchtypeTemp == "中超" || matchtypeTemp == "亚冠") {
                //不push
              } else {
                objOneDay_Rows.push(obj);
              }
              break;
            default:
              objOneDay_Rows.push(obj); //不是csl的比赛可以直接push
              break;

          }




        }

      }




      if (elementOneDay.rows.length == 0) {//这个section里无数据
        // console.log("空的")
      } else { //这个section里有数据
        rowToDayList.push(elementOneDay); //
      }




    }

    // console.log(rowToDayList) //可以用于显示拼接完成的data，用于传给list显示


    // 滚动到今天  （2），使用 rowToDayList 数据
    // console.log(currentDate)
    var arrDayForScrollLocation_section = []
    for (var kk = 0; kk < rowToDayList.length; kk++) {
      var dayForScrollLocation = rowToDayList[kk].rows[0].matchdateInFinalData;//20180507

      // console.log(dayForScrollLocation)

      var dayForScrollLocation_section = kk;

      if (dayForScrollLocation >= currentDate) {
        // console.log(dayForScrollLocation_section)

        arrDayForScrollLocation_section.push(dayForScrollLocation_section)

      }
    }


    // list所显示的header
    switch (gametype) {
      case "nba":
        var headerDisplay = "NBA赛程板";
        break;
      case "chlg":
        var headerDisplay = "欧冠赛程板";
        break;
      default:
        var headerDisplay = "赛程板";
        break;
    }


    // app导航栏文字
    let appNavTitle = $cache.get("SportsBoard_AppNavTitle")
    if (appNavTitle == undefined) { //上次没有筛选
      let appNavTitle = "Sports Board"
    }


    $ui.render({
      props: {
        id: "uiRender1",
        title: appNavTitle + "赛程板"//App导航栏文字
      },

      views: [{
        type: "list",
        props: {
          id: "listid",
          grouped: true,
          rowHeight: 73, // 行高
          actions: [
            {
              title: "设置提醒",
              handler: function (sender, indexPath) {//单击"设置提醒"时触发

                var row = indexPath.row;
                // console.log(row) // 所选row
                var section = indexPath.section;
                // console.log(section)
                var teamsForCalender = rowToDayList[section].rows[row].teams.text;
                // console.log(teamsForCalender)
                var matchtypeForCalender = rowToDayList[section].rows[row].content.text
                // console.log(matchtypeForCalender)
                var matchTimeForCalender = rowToDayList[section].rows[row].matchTime;
                // console.log(matchTimeForCalender)


                //当前插件名
                // console.log(encodeURI(currentName()))
                var calendarUrl = encodeURI("jsbox://run?name=" + currentName())

                var nowTimestamp = new Date().getTime();
                if (matchTimeForCalender > nowTimestamp / 1000) {//是还没开始的比赛
                  $calendar.create({//创建新日历
                    title: teamsForCalender + " (" + matchtypeForCalender + ")",
                    startDate: matchTimeForCalender * 1000,
                    hours: 1,
                    url: encodeURI(calendarUrl),//需要两次encodeURI
                    notes: "来自JSBox: Sports Board",
                    alarmDate: new Date() + 3600,//事件发生时提醒
                    handler: function (resp) {
                      // console.log(resp)
                      if (resp.status == 1) { //设置成功
                        $ui.toast("日历提醒设置成功")
                      }
                      if (resp.status != 1) {
                        console.log("设置失败，请检查权限")
                        $ui.toast("设置失败，请检查权限")
                      }
                    }
                  })
                } else {
                  $ui.toast("比赛已结束，不能设置提醒")
                }



              }
            }
            // {
            //   title: "share",
            //   handler: function(sender, indexPath) {

            //   }
            // }
          ],
          // header: {//显示在列表顶部
          //   type: "label",
          //   props: {
          //     height: 0,
          //     text: headerDisplay, // header,
          //     textColor: $color("#AAAAAA"),
          //     align: $align.center,
          //     font: $font(14)
          //   }
          // },
          footer: {
            type: "label",
            props: {
              height: 40,//40,下部拉动距离，为了所有比赛不被遮挡
              text: "",
              textColor: $color("#AAAAAA"),
              align: $align.center,
              font: $font(12)
            }
          },

          template: [{
            type: "label",
            props: {
              id: "content", // 比赛类型
              font: $font(11),
              textColor: $color("#888888")
            },
            layout: function (make, view) {
              make.centerX.equalTo(0)
              make.top.equalTo(2)
              // make.left.equalTo(160)
              // make.top.right.inset(8)
              make.height.equalTo(20)
            }
          }, {
            type: "label",
            props: {
              id: "teams", // 队伍
              font: $font(20),
              autoFontSize: true //字体动态调整
            },
            layout: function (make, view) {
              make.centerX.equalTo(0)
              make.top.equalTo(24)
              // make.left.equalTo(160)
              // make.top.right.inset(8)
              make.height.equalTo(24)
              make.width.lessThanOrEqualTo(190) //字体动态调整
            }
          },
          {
            type: "label",
            props: {
              id: "isOver",// 比赛时间是否结束
              textColor: $color("#888888"),
              font: $font(14)
            },
            layout: function (make, view) {
              //make.left.right.equalTo(180);

              make.top.equalTo(48)

              make.centerX.equalTo(0) // 居中 
              make.bottom.equalTo(-2)
            }
          },
          {
            type: "label",
            props: {
              id: "onewinscore", // 一队比分
              textColor: $color("#888888"),
              font: $font(20)
            },
            layout: function (make) {
              // make.left.inset(28)
              make.right.equalTo($("teams").centerX).offset(-110) //距离队伍的偏移量
              make.top.inset(16)
              make.height.equalTo(40)
            }
          },

          {
            type: "label",
            props: {
              id: "twowinscore", // 二队比分
              textColor: $color("#888888"),
              font: $font(20)
            },
            layout: function (make) {
              //make.right.equalTo(40)
              // make.right.inset(28)
              make.left.equalTo($("teams").centerX).offset(110) //距离队伍的偏移量
              make.top.inset(16)
              make.height.equalTo(40)
            }
          }
          ],
          data: rowToDayList

        },
        layout: function (make, view) {
          make.left.right.equalTo(0);
          make.top.equalTo(0);
          make.height.equalTo(view.super);
          make.bottom.equalTo(100);
        },
        events: {


          didSelect: function (tableView, indexPath) {
            var row = indexPath.row;
            // console.log(row) // 所选row
            var section = indexPath.section;
            // console.log(section)
            var gidUrl = rowToDayList[section].rows[row].gidUrl;
            // console.log(gidUrl)

            switch (gametype) {
              case "nba":
                var detailUrl = "https://m.hupu.com/" + gametype + "/game/recap_" + gidUrl + ".html"
                break;
              case "chlg": case "liga": case "epl": case "bund": case "seri": case "csl1": case "csl2": case "worldcup":  
                var detailUrl = "https://m.hupu.com/soccer/games/event/" + gidUrl   // stats,event,recap,preview
                break;
              case "csl3":
                $ui.toast("该比赛类型没有详情数据")
                break;

            }

            $ui.push({
              props: {
                title: rowToDayList[section].rows[row].teams.text
              },
              views: [{
                type: "web",
                props: {
                  url: detailUrl
                },
                layout: $layout.fill,
              }]
            })

          }
          ,
          willBeginDragging: function (sender) { // 滚动时，出现一个按钮定位到今天
            // $ui.toast("滚动了")
            $("moveToToday").hidden = false // 显示按钮
          },
          // willEndDragging: function (sender, velocity) {
          //   $delay(5, function () { // 滚动结束1s后隐藏
          //     $("moveToToday").hidden = true // 隐藏按钮
          //   })

          // }
        }
      },
      {
        type: "button",
        props: {
          title: "今天",
          id: "moveToToday",
          hidden: true
        },
        layout: function (make, view) {
          // make.right.equalTo(-30);
          make.bottom.equalTo(-80);
          make.height.equalTo(40);
          make.width.equalTo(60)
          make.right.inset(10);
        },
        events: {
          tapped: function (sender) {
            var scrollSection = arrDayForScrollLocation_section[0];
            $("listid").scrollTo({ // 滚动到今天
              indexPath: $indexPath(scrollSection, 0),
              animated: true // 默认为 true
            })
            $("moveToToday").hidden = true // 隐藏按钮

          }
        }
      },
      {
        type: "button",
        props: {
          title: "筛选比赛",
          id: "chooseItem"
        },
        layout: function (make, view) {
          // make.right.equalTo(-30);
          make.bottom.equalTo(0);
          make.height.equalTo(40);
          // make.width.equalTo(view.super)
          make.left.right.inset(-10);
        },
        events: {
          tapped: function (sender) {
            $pick.data({
              props: {
                items: [
                  ["NBA", "欧冠", "世界杯", "西甲", "英超", "德甲", "意甲", "中超", "亚冠", "中甲 足协杯", "赞赏"]   //nba,chlg
                ]
              },
              handler: function (data) {
                // console.log(data[0])
                var chosenItem = data[0];
                $ui.loading(true);//切换比赛，显示加载中按钮
                switch (chosenItem) {
                  case "NBA":
                    getDatabyGametype("nba")
                    $cache.set("lastChoice_Sport", "nba")
                    $cache.set("SportsBoard_AppNavTitle", "NBA")
                    break;
                  case "欧冠":
                    getDatabyGametype("chlg")
                    $cache.set("lastChoice_Sport", "chlg")
                    $cache.set("SportsBoard_AppNavTitle", "欧冠")
                    break;
                  case "西甲":
                    getDatabyGametype("liga")
                    $cache.set("lastChoice_Sport", "liga")
                    $cache.set("SportsBoard_AppNavTitle", "西甲")
                    break;
                  case "世界杯":
                    getDatabyGametype("worldcup")
                    $cache.set("lastChoice_Sport", "worldcup")
                    $cache.set("SportsBoard_AppNavTitle", "世界杯")
                    break;
                  case "英超":
                    getDatabyGametype("epl")
                    $cache.set("lastChoice_Sport", "epl")
                    $cache.set("SportsBoard_AppNavTitle", "英超")
                    break;
                  case "德甲":
                    getDatabyGametype("bund")
                    $cache.set("lastChoice_Sport", "bund")
                    $cache.set("SportsBoard_AppNavTitle", "德甲")
                    break;
                  case "意甲":
                    getDatabyGametype("seri")
                    $cache.set("lastChoice_Sport", "seri")
                    $cache.set("SportsBoard_AppNavTitle", "意甲")
                    break;
                  case "中超":
                    getDatabyGametype("csl1")
                    $cache.set("lastChoice_Sport", "csl1")
                    $cache.set("SportsBoard_AppNavTitle", "中超")
                    break;
                  case "亚冠":
                    getDatabyGametype("csl2")
                    $cache.set("lastChoice_Sport", "csl2")
                    $cache.set("SportsBoard_AppNavTitle", "亚冠")
                    break;
                  case "中甲 足协杯":
                    getDatabyGametype("csl3")
                    $cache.set("lastChoice_Sport", "csl3")
                    $cache.set("SportsBoard_AppNavTitle", "中甲&足协杯")
                    break;
                  case "赞赏":
                    // $ui.toast("感谢赞赏")
                    $ui.toast("感谢支持，即将跳转支付宝...")
                    $delay(1, function () { // 滚动结束3s后隐藏
                      $app.openBrowser({
                        type: 10000,
                        url: "https://qr.alipay.com/FKX02085MATAXX5Z5CCE8F"
                      })
                    })
                    break;

                }
              }
            })
          }
        }
      }

      ]
    })
    if (gameDataArr.list == false) {
      return $ui.toast("无数据");
    }

    // 初始时，定位到今天
    // console.log(arrDayForScrollLocation_section)
    if (arrDayForScrollLocation_section[0] <= 0) { //0-1为负数
      var scrollSection = arrDayForScrollLocation_section[0];
    } else {
      var scrollSection = arrDayForScrollLocation_section[0] - 1;
    }
    $("listid").scrollTo({
      indexPath: $indexPath(scrollSection, 0),
      animated: true // 默认为 true
    })
    $("moveToToday").hidden = true //隐藏按钮







  }
}



// ----版本自动更新 主程序

if (needCheckup()) {
  checkupVersion()
} else {
  // 初始时获取nba比赛
  // getDatabyGametype("nba")
  // 还没到15min需要检查更新的时候
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
      interval = 15 //检查更新的间距，min
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
  let url2i = encodeURI("jsbox://install?url=" + addinURL + "&name=" + currentName() + "&icon=" + currentIcon())  //这里可以改icon，是否只在主程序运行等
  // let url2i = encodeURI("jsbox://install?url=" + addinURL + "&name=Sports Board&icon=icon_039.png&types=1")  //这里可以改icon，是否只在主程序运行等
  $app.openURL(url2i)
}

//检查版本
function checkupVersion() {
  // $ui.loading("检查更新")
  $ui.toast("检查更新...")
  $http.download({
    url: addinURL,
    showsProgress: false,
    timeout: 5,
    handler: function (resp) {
      $console.info(resp)
      let str = resp.data.string
      $console.info(str)
      let lv = getVFS(str)
      $ui.loading(false)
      if (needUpdate(appVersion, lv)) {
        sureToUpdate(str)
      } else {
        $ui.toast("已经是最新")
        // 初始时获取nba比赛
        // getDatabyGametype("nba")
        // 不需要更新
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

//myLog
function myLog(text) {
  if ($app.env == $env.app) {
    $console.log(text)
  }
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
      handler: function () {
        updateAddin()
      }
    },
    {
      title: "否",
      handler: function () {

      }
    }
    ]
  })
}