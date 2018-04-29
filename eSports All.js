// 原作者：wlor0623，  https://github.com/wlor0623/jsbox/blob/master/lolscore.js
// 由 QvQ修改： https://github.com/FrankHan/jsbox/blob/master/LOL%20All.js  

$app.tips("点击比赛即可查看详情");

// 初始时获取全部比赛
getGameDataRender(0)

// Main program
function getGameDataRender(gameIndex) {

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
      _gtk: 184373722,
      game: gameIndex,// 0:All ,1:Dota2 , 2:lol, 4: csgo(fail), 5: OWL, 6:KPL, 8: 使命召唤OL冠军联赛
      eids: ""
    },
    handler: function (resp) {
      resp = resp;


      // ---定位到今天并render
      var data = resp.data

      //console.log(data)

      var scheduleList = data.data.scheduleList;
      for (var k in scheduleList) {
        if (scheduleList[k].week == "今天") {
          // console.log(k)
          var todayDateStore = k
        }
      }

      //console.log("todayDateStore: "+todayDateStore)

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

      //console.log(timeTArr)

      for (var i = 0; i < timeTArr.length; i++) {
        if (timeTArr[i] >= todayDateStore) {
          //console.log("定位到天index： "+i); //定位到最近一天
          render(resp, i);
          break;
        }
      }
      // ---定位到今天并render  end

    }
  })

}

// Less Main program
function render(resp, dateIndex) {
  var data = resp.data

  //  console.log(data)
  var prevdate = data.data.prevdate; //上周时间
  var nextdate = data.data.nextdate; //下周时间
  var timeArr = [];//取时间值
  var timeForHeader = [];// 显示在menu
  var timeDataArr = []; //数据值
  var rowsData = []; //列表信息
  var scheduleList = data.data.scheduleList;
  for (var key in scheduleList) {
    timeArr.push(key);
    timeForHeader.push(scheduleList[key].week);  // lDate,date,week,filterdate
    //console.log(key)  //打印日期
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

  //console.log(headerDateTip)

  var toDayList = toDayData.list; //当天比赛数据
  // console.log(toDayList);
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
    if (toDayList[i].isover == false) {
      obj.isOver.text = "进行中"
      var isOverVar = "进行中"
    } else {
      var isOverVar = ""
    }
    obj.title.text = toDayList[i].oneseedname + " : " + toDayList[i].twoseedname;
    obj.content.text = toDayList[i].ename + " " + toDayList[i].starttime //+ " " + isOverVar;
    obj.onewinscore.text = toDayList[i].onewin.toString();
    obj.twowinscore.text = toDayList[i].twowin.toString();
    obj.scheduleid.text = toDayList[i].scheduleid;
    rowToDayList.push(obj);
  }

  // console.log(rowToDayList);
  $ui.render({
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
              autoFontSize:true //字体动态调整
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
          console.log(scheduleid)
          $app.openBrowser({
            type: 10000,
            url: "http://www.wanplus.com/schedule/" + scheduleid + ".html"
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
                ["所有比赛", "LOL", "Dota2", "OWL", "KPL", "使命召唤OL"]   //0:All ,1:Dota2 , 2:lol, 4: csgo(fail), 5: OWL, 6:KPL, 8: 使命召唤OL冠军联赛
              ]
            },
            handler: function (data) {
              console.log(data[0])
              var chosenItem = data[0];
              switch (chosenItem) {
                case "所有比赛":
                  getGameDataRender(0)
                  break;
                case "LOL":
                  getGameDataRender(2)
                  break;
                case "Dota2":
                  getGameDataRender(1)
                  break;
                case "OWL":
                  getGameDataRender(5)
                  break;
                case "KPL":
                  getGameDataRender(6)
                  break;
                case "使命召唤OL":
                  getGameDataRender(8)
                  break;
              }
            }
          })
        }
      }
    }
      // {
      //   type: "button",
      //   props: {
      //     title: prevdate
      //   },
      //   layout: function (make, view) {
      //     make.left.equalTo(30);
      //     make.bottom.equalTo(-20);
      //     make.height.equalTo(40);
      //   },
      //   events: {
      //     tapped: function (sender) {
      //       $ui.toast("Tapped")
      //     }
      //   }
      // },
      // {
      //   type: "button",
      //   props: {
      //     title: nextdate
      //   },
      //   layout: function (make, view) {
      //     make.right.equalTo(-30);
      //     make.bottom.equalTo(-20);
      //     make.height.equalTo(40);
      //   },
      //   events: {
      //     tapped: function (sender) {
      //       $ui.toast("Tapped")
      //     }
      //   }
      // }

    ]
  })
  if (toDayData.list == false) {
    return $ui.toast("无数据");
  }
}

