/**
 * @Version 2.4
 * @author QvQ
 * @date 2018.5.7
 * @brief 
 *   1. 修复了一些显示小问题
 * @/brief
 */

// 原作者：wlor0623，  https://github.com/wlor0623/jsbox/blob/master/lolscore.js
// 由 QvQ修改： https://github.com/FrankHan/jsbox/blob/master/eSports%20All.js

// $app.tips("点击比赛即可查看详情");

"use strict"

// ----版本自动更新
let appVersion = 2.4
let addinURL = "https://raw.githubusercontent.com/FrankHan/jsbox/master/eSports%20All.js"


// 初始时获取上次筛选的比赛
$cache.set("isThisWeek",true)

let lastChosen_eSport = $cache.get("lastChosen_eSport")
if (lastChosen_eSport == undefined) { //上次没有筛选
  getGameDataRender(0, getUnixTimestamp())//获取全部比赛
  return true
} else {
  getGameDataRender(lastChosen_eSport, getUnixTimestamp())//获取上次的比赛
}

// getGameDataRender(0)


// 获取unix时间戳，函数
function getUnixTimestamp() {
  return Math.round(new Date().getTime() / 1000)
}


// Main program
function getGameDataRender(gameIndex, chosenTimePeriod) {

  var resp = []
  $http.post({
    url: "http://www.wanplus.com/ajax/schedule/list",
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
      eids: "",
      game: gameIndex,// 0:All ,1:Dota2 , 2:lol, 4: csgo, 5: OWL, 6:KPL, 8: 使命召唤OL冠军联赛
      time: chosenTimePeriod,//1525536000  chosenTimePeriod
      _gtk: 184373722
    },
    handler: function (resp) {
      // console.log(resp)
      // var resp = resp;
      $ui.loading(false);//切换比赛成功，隐藏加载中按钮


      // ---定位到今天并render
      var data = resp.data

      // console.log("http data 1:")

      // console.log(data)


      var scheduleList = data.data.scheduleList;


      //获取todayDateStore
      var nowDate = new Date();
      var year = nowDate.getFullYear();
      var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1)
        : nowDate.getMonth() + 1;
      var day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate
        .getDate();
      var todayDateStore = year + month + day;

      // console.log("todayDateStore: " + todayDateStore) //dota2有值

      var timeArr = [] //取时间值
      var timeDataArr = []; //数据值
      //var timeForHeader = [];// 显示在menu

      for (var key in scheduleList) {
        timeArr.push(key);
        timeDataArr.push(scheduleList[key]);
        //timeForHeader.push(scheduleList[key].week);  // lDate,date,week,filterdate
      }

      // ---无比赛过滤器
      var timeTArr = [];
      var timeTDataArr = [];
      var timeForHeaderT = [];
      for (var i = 0; i < timeDataArr.length; i++) {
        if (timeDataArr[i].list != false) {
          timeTArr.push(timeArr[i]);
          //timeForHeaderT.push(timeForHeader[i]);
          //timeTDataArr.push(timeDataArr[i]);
        }
      }
      // ---过滤器end

      // console.log(timeTArr)

      if (timeTArr.length == 0) {//7天里都没有这个比赛
        render(resp, 0);

      } else {//7天里有比赛 可以显示
        for (var i = 0; i < timeTArr.length; i++) {
          // console.log("执行了")
          if (timeTArr[i] >= todayDateStore) {
            //console.log("定位到天index： "+i); //定位到最近一天
            render(resp, i);
            break;
          } else { //上周时，没法到最近一天
            render(resp, 0);
            // break; //这回造成本周也无法定位到最近一天
          }
        }
      }


      // ---定位到今天并render  end

    }
  })

}

// Less Main program
function render(resp, dateIndex) {
  var data = resp.data // 仍然是http得到的数据
  // console.log("http data 2:")

  // console.log(data)
  var prevdate = data.data.prevdate; //上周日期
  var nextdate = data.data.nextdate; //下周日期

  var prevtime = data.data.prevtime; //上周时间
  var nexttime = data.data.nexttime; //下周时间
  $cache.set("eSport_prevTimePeriod", prevtime)
  $cache.set("eSport_nextTimePeriod", nexttime)


  // console.log(prevdate) //有值

  if (data.data.isShowList == 0) {//本周七天都没有该比赛，直接构造一个 rowToDayList
    // console.log("本周七天都没有该比赛")
    var timeForHeaderT = ["本周"];
    var headerDateTip = "本周无该比赛"; //头部日期提示

    // var rowToDayList = [//可以用
    //   {
    //     "onewinscore": {
    //       "text": ""
    //     },
    //     "content": {
    //       "text": "" //"本周无该比赛"
    //     },
    //     "twowinscore": {
    //       "text": ""
    //     },
    //     "isOver": {
    //       "text": "" //"已结束"
    //     },
    //     "scheduleid": {
    //       "text": "" //"41226"
    //     },
    //     "title": {
    //       "text": "本周无该比赛"
    //     },
    //     "gamename": {},
    //     "twoicon": {
    //       "src": "https://static.wanplus.com/data/ow/team/5098_mid.png"
    //     },
    //     "oneicon": {
    //       "src": "https://static.wanplus.com/data/ow/team/5103_mid.png"
    //     }
    //   }
    // ]

    var rowToDayList = []


  } else { //本周七天有该比赛，可以显示
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


    // ---无比赛过滤器
    var timeTArr = [];
    var timeTDataArr = [];
    var timeForHeaderT = [];
    for (var i = 0; i < timeDataArr.length; i++) {
      if (timeDataArr[i].list != false) {
        timeTArr.push(timeArr[i]);
        timeForHeaderT.push(timeForHeader[i]);
        timeTDataArr.push(timeDataArr[i]);
      }
    }
    // ---过滤器end


    // console.log(timeArr)
    var toDayData = timeTDataArr[dateIndex]; //当天数据 
    var headerDateTip = toDayData.lDate; //头部日期提示



    var selectedDayTimeStamp = toDayData.time; //当天的时间戳，为当天00:00
    //console.log(selectedDayTimeStamp)
    var realtime = new Date()
    var realtimeStamp = realtime.getTime();//realtime
    //console.log(realtimeStamp / 1000)
    var realtimeHour = realtime.getHours();//获取当前时间小时数值0~23 
    var realtimeMinute = realtime.getMinutes()

    //console.log(headerDateTip)

    var toDayList = toDayData.list; //当天比赛数据
    // // console.log(toDayList);
    var rowToDayList = []; //每行比赛数据



    for (var i = 0; i < toDayList.length; i++) {
      var obj = {};
      obj.title = {};
      obj.content = {};
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

      if (toDayList[i].isover == false) {
        if (realtimeStamp / 1000 >= selectedDayTimeStamp) {//选中了今天

          // 获取当前比赛的时间
          var currentCompeStarttime = toDayList[i].starttime
          var currentCompeStartHour = currentCompeStarttime.split(":")[0];
          var currentCompeStartMinute = currentCompeStarttime.split(":")[1];
          //console.log(currentCompeStartHour + " " + currentCompeStartMinute)
          if (realtimeHour >= currentCompeStartHour && realtimeMinute >= currentCompeStartMinute) { //当天进行中的
            obj.isOver.text = "进行中"
            var isOverVar = "进行中"
          } else {// 当天还没开始
            obj.isOver.text = "未开始"
            var isOverVar = "未开始"
            obj.onewinscore.text = "";
            obj.twowinscore.text = "";
          }
        } else {
          obj.isOver.text = "未开始"//后面天
          var isOverVar = "未开始"
          obj.onewinscore.text = "";
          obj.twowinscore.text = "";
        }
      } else {
        var isOverVar = "已结束"//已结束的比赛
        obj.isOver.text = "已结束"
      }
      obj.title.text = toDayList[i].oneseedname + " : " + toDayList[i].twoseedname;
      obj.content.text = toDayList[i].ename + " " + toDayList[i].starttime //+ " " + isOverVar;
      obj.scheduleid.text = toDayList[i].scheduleid;

      // 下面获取比赛开始的unix时间
      var Date_temp = toDayList[i].relation.toString();

      var Date_temp2 = Date_temp.substring(0, 4) + "-" + Date_temp.substring(4, 6) + "-" + Date_temp.substring(6, 8)
      // console.log(Date_temp)
      var hourminute = toDayList[i].starttime;
      var hourminuteSecond = hourminute + ":00"
      var Date_temp3 = Date_temp2 + " " + hourminuteSecond;
      // console.log(Date_temp3)
      //下面转换为unix时间
      var str = Date_temp3;
      str = str.replace(/-/g, "/");
      var date = new Date(str);
      var humanDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
      obj.matchTime = humanDate.getTime() / 1000 - 8 * 60 * 60; //转换为了unix时间





      rowToDayList.push(obj);
    }
  }





  // app导航栏文字
  let appNavTitle = $cache.get("eSportsAll_AppNavTitle")
  if (appNavTitle == undefined) { //上次没有筛选
    let appNavTitle = "eSports All"
  }


  // console.log("rowToDayList:"); //拼接完成用于list显示
  // console.log(rowToDayList);


  let isThisWeek = $cache.get("isThisWeek")
  // console.log("回到本周")




  $ui.render({
    props: {
      id: "uiRender1",
      title: appNavTitle//App导航栏文字
    },
    views: [{
      type: "menu",
      props: {
        //items: timeTArr,
        items: timeForHeaderT,
        index: dateIndex
      },
      layout: function (make) {
        make.left.top.right.equalTo(0)
        make.height.equalTo(44)
      },
      events: {
        changed: function (sender) {
          var items = sender.items
          var index = sender.index;
          render(resp, index);
          // $ui.toast(index + ": "  + items[index]);
        }
      }
    }, {
      type: "list",
      props: {
        grouped: true,
        rowHeight: 70, // 行高
        actions: [
          {
            title: "设置提醒",
            handler: function (sender, indexPath) {//单击"设置提醒"时触发

              // console.log(indexPath)

              var row = indexPath.row;
              // console.log(row) // 所选row
              // var section = indexPath.section;
              // console.log(section)
              var teamsForCalender = rowToDayList[row].title.text;
              // console.log(teamsForCalender)
              var matchtypeForCalender = rowToDayList[row].content.text //要改的
              // console.log(matchtypeForCalender)
              var matchTimeForCalender = rowToDayList[row].matchTime;
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
        header: {
          type: "label",
          props: {
            height: 20,
            text: headerDateTip,
            textColor: $color("#AAAAAA"),
            align: $align.center,
            font: $font(14)
          }
        },
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
              id: "isOver", // 进行中
              font: $font(10),
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
              id: "title", // 队伍
              font: $font(20),
              autoFontSize: true //字体动态调整
            },
            layout: function (make, view) {
              make.centerX.equalTo(0)
              make.top.equalTo(18)
              // make.left.equalTo(160)
              // make.top.right.inset(8)
              make.height.equalTo(24),
                make.width.lessThanOrEqualTo(200) //字体动态调整
            }
          },
          {
            type: "label",
            props: {
              id: "content",
              textColor: $color("#888888"),
              font: $font(15)
            }, // 比赛时间 id content
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
              font: $font(25)
            },
            layout: function (make) {
              // make.left.inset(28)
              make.right.equalTo($("title").centerX).offset(-125) //距离队伍的偏移量
              make.top.inset(10)
              make.height.equalTo(40)
            }
          },
          // {
          //   type: "image",
          //   props: {
          //     id: "oneicon", //一队图标
          //     radius:20
          //   },
          //   layout: function (make, view) {
          //     // make.left.inset(60);
          //     make.right.equalTo($("title").left).offset(-20) //距离队伍的偏移量
          //     // make.left.equalTo(view.centerX).offset(30) //距离center的偏移量
          //     make.top.equalTo(10);
          //     make.size.equalTo(40)
          //   }
          // },
          // {
          //   type: "image",
          //   props: {
          //     id: "twoicon", //二队图标
          //     radius: 20
          //   },
          //   layout: function (make, view) {
          //     make.right.inset(60);
          //     make.top.equalTo(10);
          //     make.size.equalTo(40)
          //   }
          // },
          {
            type: "label",
            props: {
              id: "twowinscore",// 二队比分
              textColor: $color("#888888"),
              font: $font(25)
            },
            layout: function (make) {
              //make.right.equalTo(40)
              // make.right.inset(28)
              make.left.equalTo($("title").centerX).offset(125) //距离队伍的偏移量
              make.top.inset(10)
              make.height.equalTo(40)
            }
          }
        ],
        data: [{
          rows: rowToDayList
        }]
      },
      layout: function (make, view) {
        make.left.right.equalTo(0);
        make.top.equalTo(45);
        make.height.equalTo(view.super);
        make.bottom.equalTo(100);
      },
      events: {
        didSelect: function (tableView, indexPath) {
          var row = indexPath.row;
          var scheduleid = rowToDayList[row].scheduleid.text;
          // console.log(scheduleid)

          $ui.push({
            props: {
              title: rowToDayList[row].title.text
            },
            views: [{
              type: "web",
              props: {
                url: "http://www.wanplus.com/schedule/" + scheduleid + ".html"
              },
              layout: $layout.fill,
            }]
          })

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
                ["所有比赛", "LOL", "Dota2", "守望先锋", "csgo", "KPL", "使命召唤OL", "赞赏"]   //0:All ,1:Dota2 , 2:lol, 4: csgo, 5: OWL, 6:KPL, 8: 使命召唤OL冠军联赛
              ]
            },
            handler: function (data) {
              // console.log(data[0])
              $ui.loading(true);//切换比赛，显示加载中按钮
              var chosenItem = data[0];
              switch (chosenItem) {
                case "所有比赛":
                  getGameDataRender(0, getUnixTimestamp())
                  $cache.set("lastChosen_eSport", 0)
                  $cache.set("eSportsAll_AppNavTitle", "全部比赛")
                  $cache.set("isThisWeek",true)
                  break;
                case "LOL":
                  getGameDataRender(2, getUnixTimestamp())
                  $cache.set("lastChosen_eSport", 2)
                  $cache.set("eSportsAll_AppNavTitle", "LOL赛程")
                  $cache.set("isThisWeek",true)
                  break;
                case "Dota2":
                  getGameDataRender(1, getUnixTimestamp())
                  $cache.set("lastChosen_eSport", 1)
                  $cache.set("eSportsAll_AppNavTitle", "Dota2赛程")
                  $cache.set("isThisWeek",true)
                  break;
                case "守望先锋":
                  getGameDataRender(5, getUnixTimestamp())
                  $cache.set("lastChosen_eSport", 5)
                  $cache.set("eSportsAll_AppNavTitle", "守望先锋")
                  $cache.set("isThisWeek",true)
                  break;
                case "csgo":
                  getGameDataRender(4, getUnixTimestamp())
                  $cache.set("lastChosen_eSport", 4)
                  $cache.set("eSportsAll_AppNavTitle", "CS:GO赛程")
                  $cache.set("isThisWeek",true)
                  break;
                case "KPL":
                  getGameDataRender(6, getUnixTimestamp())
                  $cache.set("lastChosen_eSport", 6)
                  $cache.set("eSportsAll_AppNavTitle", "KPL联赛")
                  $cache.set("isThisWeek",true)
                  break;
                case "使命召唤OL":
                  getGameDataRender(8, getUnixTimestamp())
                  $cache.set("lastChosen_eSport", 8)
                  $cache.set("eSportsAll_AppNavTitle", "使命召唤OL")
                  $cache.set("isThisWeek",true)
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
    },
    {
      type: "button",
      props: {
        title: "本周",
        id: "moveToToday",
        hidden: isThisWeek
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
          $cache.set("isThisWeek",true)


          let lastChosen_eSport = $cache.get("lastChosen_eSport")
          if (lastChosen_eSport == undefined) { //上次没有筛选
            getGameDataRender(0, getUnixTimestamp())//获取全部比赛
            return true
          } else {
            getGameDataRender(lastChosen_eSport, getUnixTimestamp())//获取上次的比赛
          }


          $("moveToToday").hidden = true // 隐藏按钮

        }
      }
    },
    {
      type: "button",
      props: {
        title: "上周"// prevdate
      },
      layout: function (make, view) {
        make.left.equalTo(2);
        // make.bottom.equalTo(-20);
        make.width.equalTo(60);
        make.bottom.equalTo(0);
        make.height.equalTo(40);
      },
      events: {
        tapped: function (sender) {
          // $ui.toast("上周")
          $cache.set("isThisWeek",false)
          let eSport_prevTimePeriod = $cache.get("eSport_prevTimePeriod")

          // $cache.set("eSport_chosenTimePeriod", eSport_prevTimePeriod)

          // 获取上周的比赛
          let lastChosen_eSport = $cache.get("lastChosen_eSport")
          if (lastChosen_eSport == undefined) { //上次没有筛选
            getGameDataRender(0, eSport_prevTimePeriod)//获取全部比赛
            return true
          } else {
            // console.log(eSport_prevTimePeriod)
            // console.log(lastChosen_eSport)
            getGameDataRender(lastChosen_eSport, eSport_prevTimePeriod)//获取上次的比赛
          }


        }
      }
    },
    {
      type: "button",
      props: {
        title: "下周"//nextdate
      },
      layout: function (make, view) {
        make.right.equalTo(-15);
        make.bottom.equalTo(0);
        make.height.equalTo(40);
      },
      events: {
        tapped: function (sender) {
          // $ui.toast("下周")
          $cache.set("isThisWeek",false)
          $("moveToToday").hidden = false // 隐藏按钮

          let eSport_nextTimePeriod = $cache.get("eSport_nextTimePeriod")

          // $cache.set("eSport_chosenTimePeriod", eSport_nextTimePeriod)

          // 获取下周的比赛
          let lastChosen_eSport = $cache.get("lastChosen_eSport")
          if (lastChosen_eSport == undefined) { //上次没有筛选
            getGameDataRender(0, eSport_nextTimePeriod)//获取全部比赛
            return true
          } else {
            // console.log(eSport_nextTimePeriod)
            // console.log(lastChosen_eSport)
            getGameDataRender(lastChosen_eSport, eSport_nextTimePeriod)//获取上次的比赛
          }

        }
      }
    }
    


    ]
  })
  if (toDayData.list == false) {
    return $ui.toast("无数据");
  }
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