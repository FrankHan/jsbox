/**
 * @Version 2.7
 * @author QvQ
 * @date 2018.6.5
 * @brief 
 *   1. 修复了api
 *   2. 其他优化
 * @/brief
 */

// 原作者：wlor0623，  https://github.com/wlor0623/jsbox/blob/master/lolscore.js
// 由 QvQ修改： https://github.com/FrankHan/jsbox/blob/master/eSports%20All.js

// $app.tips("点击比赛即可查看详情");

"use strict"

// ----版本自动更新
let appVersion = 2.7
let addinURL = "https://raw.githubusercontent.com/FrankHan/jsbox/master/eSports%20All.js"

// 初始情况
let lastChosen_eSport = $cache.get("lastChosen_eSport")
if (lastChosen_eSport == undefined) { //上次没有筛选
  getGameDataRender("all")//获取全部比赛
  return true
} else {
  getGameDataRender(lastChosen_eSport)//获取上次的比赛
}


// 获取unix时间戳，函数
function getUnixTimestamp() {
  return Math.round(new Date().getTime() / 1000)
}


// Main program
// 先打开控制台，再进行同步可以看到console.log内容
function getGameDataRender(gameIndex) {

  switch (gameIndex) {
    case "all"://全部比赛
      // 全部
      var getUrl = "https://www.wanplus.com/api.php?_param=56bc03c3ebc4cfabd11110b66264070c%7Cios%7C200%7C4.1.3%7C26%7C1528212292%7C765757%7CnfV0trKja37maU3%2Bnzz9m7/OVKO1/iPCJcU23lTw4MGytYXrl/WBH3Q1hdw5Tvo%7C2&c=App_Event&eids=603,645,576,604,583,611,590,639,646,591,612,647,592,606,613,579,621,586,614,593,594,622,552,615,588,616,595,623,630,589,596,624,631,625,632,598,640,619,626,633,599,634,641,635,642,600,628,572,580,636,643,637,644,581,638,&m=schdListThrough&tflag=0&sig=9d4fe3e808dd77cb4e03862b6a0b2d50&c=App_Event&eids=603%2C645%2C576%2C604%2C583%2C611%2C590%2C639%2C646%2C591%2C612%2C647%2C592%2C606%2C613%2C579%2C621%2C586%2C614%2C593%2C594%2C622%2C552%2C615%2C588%2C616%2C595%2C623%2C630%2C589%2C596%2C624%2C631%2C625%2C632%2C598%2C640%2C619%2C626%2C633%2C599%2C634%2C641%2C635%2C642%2C600%2C628%2C572%2C580%2C636%2C643%2C637%2C644%2C581%2C638%2C&m=schdListThrough&tflag=0"
      break;
    case "lol":
      // lol 
      var getUrl = "https://www.wanplus.com/api.php?_param=56bc03c3ebc4cfabd11110b66264070c%7Cios%7C200%7C4.1.3%7C26%7C1528208999%7C765757%7CnfV0trKja37maU3%2Bnzz9m7/OVKO1/iPCJcU23lTw4MGytYXrl/WBH3Q1hdw5Tvo%7C2&c=App_Event&eids=644,616,579,580,640,623,645,583,626,572,643,581,613,589,638,&m=schdListThrough&tflag=0&sig=0ad28d6889357b9ddd03516b560bcabf&c=App_Event&eids=644%2C616%2C579%2C580%2C640%2C623%2C645%2C583%2C626%2C572%2C643%2C581%2C613%2C589%2C638%2C&m=schdListThrough&tflag=0"
      break;
    case "dota2":
      var getUrl = "https://www.wanplus.com/api.php?_param=56bc03c3ebc4cfabd11110b66264070c%7Cios%7C200%7C4.1.3%7C26%7C1528210522%7C765757%7CnfV0trKja37maU3%2Bnzz9m7/OVKO1/iPCJcU23lTw4MGytYXrl/WBH3Q1hdw5Tvo%7C2&c=App_Event&eids=590,622,625,612,596,621,598,624,604,600,&m=schdListThrough&tflag=0&sig=9736a3f73f435fe80737392aa407ccbc&c=App_Event&eids=590%2C622%2C625%2C612%2C596%2C621%2C598%2C624%2C604%2C600%2C&m=schdListThrough&tflag=0"
      break;
    case "csgo":
      var getUrl = "https://www.wanplus.com/api.php?_param=56bc03c3ebc4cfabd11110b66264070c%7Cios%7C200%7C4.1.3%7C26%7C1528212025%7C765757%7CnfV0trKja37maU3%2Bnzz9m7/OVKO1/iPCJcU23lTw4MGytYXrl/WBH3Q1hdw5Tvo%7C2&c=App_Event&eids=611,593,576,636,614,603,639,591,606,594,588,599,615,586,635,646,&m=schdListThrough&tflag=0&sig=fcf84333ac3cc1cb34ee2335d9abff56&c=App_Event&eids=611%2C593%2C576%2C636%2C614%2C603%2C639%2C591%2C606%2C594%2C588%2C599%2C615%2C586%2C635%2C646%2C&m=schdListThrough&tflag=0"
      break;
    case "ow":
      var getUrl = "https://www.wanplus.com/api.php?_param=56bc03c3ebc4cfabd11110b66264070c%7Cios%7C200%7C4.1.3%7C26%7C1528209958%7C765757%7CnfV0trKja37maU3%2Bnzz9m7/OVKO1/iPCJcU23lTw4MGytYXrl/WBH3Q1hdw5Tvo%7C2&c=App_Event&eids=552,595,&m=schdListThrough&tflag=0&sig=d7657c7c413b9565af5cf50b76f42c45&c=App_Event&eids=552%2C595%2C&m=schdListThrough&tflag=0"
      break;
    case "kpl":
      var getUrl = "https://www.wanplus.com/api.php?_param=56bc03c3ebc4cfabd11110b66264070c%7Cios%7C200%7C4.1.3%7C26%7C1528212095%7C765757%7CnfV0trKja37maU3%2Bnzz9m7/OVKO1/iPCJcU23lTw4MGytYXrl/WBH3Q1hdw5Tvo%7C2&c=App_Event&eids=592,&m=schdListThrough&tflag=0&sig=95391b81132eb3837273065c416ee9ae&c=App_Event&eids=592%2C&m=schdListThrough&tflag=0"
      break;
    case "使命召唤":
      var getUrl = ""
      break;
    case "绝地求生":
      var getUrl = "https://www.wanplus.com/api.php?_param=56bc03c3ebc4cfabd11110b66264070c%7Cios%7C200%7C4.1.3%7C26%7C1528212180%7C765757%7CnfV0trKja37maU3%2Bnzz9m7/OVKO1/iPCJcU23lTw4MGytYXrl/WBH3Q1hdw5Tvo%7C2&c=App_Event&eids=642,632,619,641,628,634,637,647,630,633,631,&m=schdListThrough&tflag=0&sig=67539ad8a2ea6894b967f6ccca6cd57d&c=App_Event&eids=642%2C632%2C619%2C641%2C628%2C634%2C637%2C647%2C630%2C633%2C631%2C&m=schdListThrough&tflag=0"
      break;
    default://全部比赛
      var getUrl = "https://www.wanplus.com/api.php?_param=56bc03c3ebc4cfabd11110b66264070c%7Cios%7C200%7C4.1.3%7C26%7C1528167258%7C765757%7CnfV0trKja37maU3%2Bnzz9m7/OVKO1/iPCJcU23lTw4MGytYXrl/WBH3Q1hdw5Tvo%7C2&c=App_Event&eids=588,634,580,621,594,640,581,589,635,603,576,622,616,641,595,636,604,623,596,642,583,637,624,643,611,619,630,638,606,579,625,598,590,612,552,631,639,572,626,599,591,613,586,632,645,600,592,614,633,593,628,615,&m=schdListThrough&tflag=0&sig=58b556e1fa6099fe63f398733e7b5282&c=App_Event&eids=588%2C634%2C580%2C621%2C594%2C640%2C581%2C589%2C635%2C603%2C576%2C622%2C616%2C641%2C595%2C636%2C604%2C623%2C596%2C642%2C583%2C637%2C624%2C643%2C611%2C619%2C630%2C638%2C606%2C579%2C625%2C598%2C590%2C612%2C552%2C631%2C639%2C572%2C626%2C599%2C591%2C613%2C586%2C632%2C645%2C600%2C592%2C614%2C633%2C593%2C628%2C615%2C&m=schdListThrough&tflag=0"
      break;
  }

  var resp = []
  $http.post({
    url: getUrl,
    header: {
      "X-Requested-With": "XMLHttpRequest",
      "Accept": "application/json, text/javascript, */*; q=0.01",
      "Accept-Encoding": "gzip, deflate",
      "Accept-Language": "zh-CN,zh;q=0.9",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "Cookie": "wanplus_token=748eb4703f9afac18fb4c1330f8556a7; wanplus_storage=lf4m67eka3o; wanplus_sid=df20830483a4ac7ac2ff3712997655e9; wanplus_csrf=_csrf_tk_184373722; wp_pvid=427144384; wp_info=ssid=s1067845980; isShown=1; gameType=2",
      "Host": "www.wanplus.com",
      "Origin": "http://www.wanplus.com",
      "Referer": "http://www.wanplus.com/lol/schedule",
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1",
      "X-CSRF-Token": "184373722"
    },
    body: {
      // eids: "",
      // game: gameIndex,// 0:All ,1:Dota2 , 2:lol, 4: csgo, 5: OWL, 6:KPL, 8: 使命召唤OL冠军联赛，9：绝地求生
      // time: chosenTimePeriod,//1525536000  chosenTimePeriod
      // _gtk: 184373722
    },
    handler: function (resp) {

      // console.log("请求到的全部数据：")
      // console.log(resp.data)
      $ui.loading(false);//切换比赛成功，隐藏加载中按钮
      // ---定位到今天并render
      var data = resp.data

      render(resp)

    }
  })
}


// Less Main program
function render(resp) {
  var data = resp.data // 仍然是http得到的数据
  // console.log("http data 2:")

  // console.log(data)



  var scheduleList = data.data.scheduleList;
  for (var k in scheduleList) {
    if (scheduleList[k].week == "今天") {//是本周
      $cache.set("isThisWeek", true)//隐藏本周按钮
    }
  }

  var prevdate = data.data.prevdate; //上周日期
  var nextdate = data.data.nextdate; //下周日期



  var prevtime = data.data.prevtime; //上周时间
  var nexttime = data.data.nexttime; //下周时间
  $cache.set("eSport_prevTimePeriod", prevtime)
  $cache.set("eSport_nextTimePeriod", nexttime)


  // console.log(prevdate) //有值

  //本周七天有该比赛，可以显示
  var timeArr = [];//取时间值
  var timeForHeader = [];// 显示在menu
  var timeDataArr = []; //数据值
  var rowsData = []; //列表信息
  var scheduleList = data.data.scheduleList;
  for (var key in scheduleList) {
    timeArr.push(key);
    timeForHeader.push(scheduleList[key].week);  // lDate,date,week,filterdate
    // console.log(key)  //打印日期
    timeDataArr.push(scheduleList[key]);
  }



  // var selectedDayTimeStamp = toDayData.time; //当天的时间戳，为当天00:00
  //console.log(selectedDayTimeStamp)
  var realtime = new Date()
  var realtimeStamp = realtime.getTime();//realtime
  //console.log(realtimeStamp / 1000)
  var realtimeHour = realtime.getHours();//获取当前时间小时数值0~23 
  var realtimeMinute = realtime.getMinutes()

  //console.log(headerDateTip)

  var toDayList = data.data.schdList; //当天比赛数据

  // console.log(data)
  // console.log("请求到的数据：")
  // console.log(toDayList);
  var rowToDayList = []; //每行比赛数据

  var sectionHeaderArr = []; //section header
  var objOneDay_Rows = [];//初始化



  for (var i = 0; i < toDayList.length; i++) {
    var obj = {};
    obj.teams = {};

    obj.gamename = {};
    obj.onewinscore = {};
    obj.twowinscore = {};
    obj.scheduleid = {};
    obj.isOver = {};//是否正在进行中
    obj.oneicon = {}; //一队图标
    obj.twoicon = {}; //二队图标



    obj.oneicon.src = toDayList[i].oneicon;
    obj.twoicon.src = toDayList[i].twoicon;
    obj.onewinscore.text = toDayList[i].onewin.toString();
    obj.twowinscore.text = toDayList[i].twowin.toString();



    obj.isOver.text = toDayList[i].starttime //比赛开始时间


    // 添加已结束、进行中、未开始的提示
    var gameStatus = toDayList[i].status
    switch (gameStatus) {
      case 1://未开始
        obj.isOver.text = obj.isOver.text;
        obj.onewinscore.text = "";
        obj.twowinscore.text = "";
        break;
      case 2:
        obj.isOver.text = obj.isOver.text + " 进行中";
        break;
      case 3:
        obj.isOver.text = obj.isOver.text + " 已结束";
        break;
      default:
        break;
    }

    obj.teams.text = toDayList[i].oneseedname + " : " + toDayList[i].twoseedname;
    obj.gamename.text = toDayList[i].ename  //+ " " + isOverVar;
    obj.scheduleid.text = toDayList[i].scheduleid;
    obj.matchdateInFinalData = toDayList[i].startdate;//20180507
    obj.matchtimeInFinalData = toDayList[i].timestamp;//1527116400
    obj.gametypeInFinalData = toDayList[i].gametype;//9

    obj.everyDate = toDayList[i].date;
    // console.log(obj.everyDate)

    // 特例：绝地求生的比赛需要清空比分
    var gameTypeInResp = toDayList[i].gametype;
    if (gameTypeInResp == 9) {
      obj.onewinscore.text = "";
      obj.twowinscore.text = "";
      obj.teams.text = toDayList[i].name[0];
    }



    // 下面拼接数据用于list显示
    if (i == 0) {//第一个日期
      sectionHeaderArr.push(obj.everyDate)

      // push数据
      // rowToDayList.push(elementOneDay);
    }

    if (toDayList[i].date == sectionHeaderArr[sectionHeaderArr.length - 1]) {//如果等于sectionHeaderArr（不重复的）最后一位
      // push数据
      objOneDay_Rows.push(obj);
    } else {//新的一天



      var elementOneDay = { //这必须是一个obj element好像
        title: sectionHeaderArr[sectionHeaderArr.length - 1],
        rows: objOneDay_Rows
      };

      sectionHeaderArr.push(obj.everyDate)
      // push数据
      rowToDayList.push(elementOneDay);
      var objOneDay_Rows = [];//初始化
      objOneDay_Rows.push(obj);
    }


    // rowToDayList.push(obj); //可以：所有天数放在一列显示
  }


  // console.log("拼接之后：")
  // console.log(rowToDayList)


  // 滚动到今天
  // 当前日期 currentDate 20180605
  var nowDate = new Date();
  var year = nowDate.getFullYear();
  var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1)
    : nowDate.getMonth() + 1;
  var day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate
    .getDate();
  var currentDate = year + month + day;
  var currentDate = parseInt(currentDate);
  // console.log(parseInt(currentDate))




  // 滚动到今天  ，使用 rowToDayList 数据
  // console.log(currentDate)
  var arrDayForScrollLocation_section = []
  for (var kk = 0; kk < rowToDayList.length; kk++) {

    if (rowToDayList[kk].rows.length == 0) {//当天没有比赛

    } else {
      var dayForScrollLocation = rowToDayList[kk].rows[0].matchdateInFinalData;//20180507
      var dayForScrollLocation_section = kk;
      if (dayForScrollLocation >= currentDate) {
        // console.log("今天之后的")
        arrDayForScrollLocation_section.push(dayForScrollLocation_section)
      }
    }
  }
  // console.log(arrDayForScrollLocation_section)



  // app导航栏文字
  let appNavTitle = $cache.get("eSportsAll_AppNavTitle")
  if (appNavTitle == undefined) { //上次没有筛选
    let appNavTitle = "eSports All"
  }


  // 每天的比赛进行排序  : rowToDayList[kk].rows数组内的元素按照 matchtimeInFinalData 进行排序
  function compare(property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    }
  }

  for (var kk = 0; kk < rowToDayList.length; kk++) {
    rowToDayList[kk].rows.sort(compare('matchtimeInFinalData')); // isOver.text 18:00需要只取：前面的
  }




  $ui.render({
    props: {
      id: "uiRender1",
      title: appNavTitle//App导航栏文字
    },
    views: [
      {
        type: "list",
        props: {
          id: "listid",
          grouped: true,
          rowHeight: 73, // 行高
          actions: [
            {
              title: "设置提醒",
              handler: function (sender, indexPath) {//单击"设置提醒"时触发

                // console.log(indexPath)

                var row = indexPath.row;
                // console.log(row) // 所选row
                var section = indexPath.section;
                // console.log(section)
                var teamsForCalender = rowToDayList[section].rows[row].teams.text;
                // console.log(teamsForCalender)
                var matchtypeForCalender = rowToDayList[section].rows[row].gamename.text;
                // console.log(matchtypeForCalender)
                var matchTimeForCalender = rowToDayList[section].rows[row].matchtimeInFinalData;
                // console.log(matchTimeForCalender)
                var matchTimeNorForCalender = rowToDayList[section].rows[row].isOver.text;


                //当前插件名
                // console.log(encodeURI(currentName()))
                var calendarUrl = encodeURI("jsbox://run?name=" + currentName())

                var nowTimestamp = new Date().getTime();



                if (matchTimeForCalender > nowTimestamp / 1000) {//是还没开始的比赛
                  $calendar.create({//创建新日历
                    title: teamsForCalender + " (" + matchtypeForCalender + ")" + ", " + matchTimeNorForCalender + "开始",
                    startDate: matchTimeForCalender * 1000,
                    hours: 1,
                    url: encodeURI(calendarUrl),//需要两次encodeURI
                    notes: "来自JSBox: eSports All",
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

          footer: {
            type: "label",
            props: {
              height: 80,//20,下部拉动距离，为了所有比赛不被遮挡
              text: "",
              textColor: $color("#AAAAAA"),
              align: $align.center,
              font: $font(12)
            }
          },
          template: [
            {
              type: "label",
              props: {
                id: "gamename", // 比赛类型
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
                id: "isOver",// 比赛时间 是否结束
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
                id: "onewinscore",// 一队比分
                textColor: $color("#888888"),
                font: $font(23)
              },
              layout: function (make) {
                // make.left.inset(28)
                make.right.equalTo($("teams").centerX).offset(-115) //距离队伍的偏移量
                make.top.inset(16)
                make.height.equalTo(40)
              }
            },
            {
              type: "label",
              props: {
                id: "twowinscore",// 二队比分
                textColor: $color("#888888"),
                font: $font(23)
              },
              layout: function (make) {
                //make.right.equalTo(40)
                // make.right.inset(28)
                make.left.equalTo($("teams").centerX).offset(115) //距离队伍的偏移量
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
            var scheduleid = rowToDayList[section].rows[row].scheduleid.text;
            // console.log(scheduleid)

            // 特例：绝地求生比赛没有详情数据
            let gametypeInFinalData = rowToDayList[section].rows[row].gametypeInFinalData;
            if (gametypeInFinalData == 9) {
              $ui.toast("绝地求生暂无比赛详情")
            }


            $ui.push({
              props: {
                title: rowToDayList[section].rows[row].teams.text
              },
              views: [{
                type: "web",
                props: {
                  url: "http://www.wanplus.com/schedule/" + scheduleid + ".html"
                },
                layout: $layout.fill,
              }]
            })

          },
          willBeginDragging: function (sender) { // 滚动时，出现一个按钮定位到今天
            // $ui.toast("滚动了")
            $("moveToToday").hidden = false // 显示按钮
          }
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
          title: "筛选比赛"
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
                  ["所有比赛", "LOL", "Dota2", "守望先锋", "csgo", "KPL", "绝地求生", "赞赏"]   //0:All ,1:Dota2 , 2:lol, 4: csgo, 5: OWL, 6:KPL, 8: 使命召唤OL冠军联赛
                ]
              },
              handler: function (data) {
                // console.log(data[0])
                $ui.loading(true);//切换比赛，显示加载中按钮
                var chosenItem = data[0];
                switch (chosenItem) {
                  case "所有比赛":
                    getGameDataRender("all")
                    $cache.set("lastChosen_eSport", "all")
                    $cache.set("eSportsAll_AppNavTitle", "全部比赛")
                    $cache.set("isThisWeek", true)
                    break;
                  case "LOL":
                    getGameDataRender("lol")
                    $cache.set("lastChosen_eSport", "lol")
                    $cache.set("eSportsAll_AppNavTitle", "LOL赛程")
                    $cache.set("isThisWeek", true)
                    break;
                  case "Dota2":
                    getGameDataRender("dota2")
                    $cache.set("lastChosen_eSport", "dota2")
                    $cache.set("eSportsAll_AppNavTitle", "Dota2赛程")
                    $cache.set("isThisWeek", true)
                    break;
                  case "守望先锋":
                    getGameDataRender("ow")
                    $cache.set("lastChosen_eSport", "ow")
                    $cache.set("eSportsAll_AppNavTitle", "守望先锋")
                    $cache.set("isThisWeek", true)
                    break;
                  case "csgo":
                    getGameDataRender("csgo")
                    $cache.set("lastChosen_eSport", "csgo")
                    $cache.set("eSportsAll_AppNavTitle", "CS:GO赛程")
                    $cache.set("isThisWeek", true)
                    break;
                  case "KPL":
                    getGameDataRender("kpl")
                    $cache.set("lastChosen_eSport", "kpl")
                    $cache.set("eSportsAll_AppNavTitle", "KPL联赛")
                    $cache.set("isThisWeek", true)
                    break;
                  //                  case "使命召唤OL":
                  //                    getGameDataRender("使命召唤")
                  //                    $cache.set("lastChosen_eSport", "使命召唤")
                  //                    $cache.set("eSportsAll_AppNavTitle", "使命召唤OL")
                  //                    $cache.set("isThisWeek", true)
                  //                    break;
                  case "绝地求生":
                    getGameDataRender("绝地求生")
                    $cache.set("lastChosen_eSport", "绝地求生")
                    $cache.set("eSportsAll_AppNavTitle", "绝地求生")
                    $cache.set("isThisWeek", true)
                    break;
                  case "赞赏":
                    // $ui.toast("感谢赞赏")
                    $ui.toast("感谢支持，即将跳转支付宝...")
                    $delay(1, function () { // 滚动结束3s后隐藏
                      $ui.loading(false);//切换比赛，显示加载中按钮
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
  // if (toDayData.list == false) {
  //   return $ui.toast("无数据");
  // }



  // 初始时，定位到今天
  // console.log(arrDayForScrollLocation_section)
  if (arrDayForScrollLocation_section[0] <= 0) { //0-1为负数
    var scrollSection = arrDayForScrollLocation_section[0];
  } else {
    var scrollSection = arrDayForScrollLocation_section[0] - 1;
  }
  // console.log(arrDayForScrollLocation_section)
  $("listid").scrollTo({
    indexPath: $indexPath(scrollSection, 0),
    animated: true // 默认为 true
  })
  $("moveToToday").hidden = true //隐藏按钮


}


// 自动更新的主程序
if (needCheckup()) {
  checkupVersion()
} else {
  // 还没到15min需要更新的时候
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
  // let url2i = encodeURI("jsbox://install?url=" + addinURL + "&name=eSports%20All&icon=icon_039.png&types=1" )  //这里可以改icon，是否只在主程序运行等
  $app.openURL(url2i)
}

//检查版本
function checkupVersion() {
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
        // 已经是最新
        $ui.toast("已经是最新")
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