// 原作者：wlor0623，  https://github.com/wlor0623/jsbox/blob/master/lolscore.js
// 由 QvQ修改： https://github.com/FrankHan/jsbox/blob/master/LOL%20All.js  

// menu 是天，对应于games[0], gamesp[1]，不行：太多天了。必须使用list加section的方法

let appVersion = 1.2

// $app.tips("点击比赛即可查看详情"); 

// 初始时获取NBA比赛
getDatabyGametype("nba") //nba, chlg

function getDatabyGametype(gametype) {

  var resp = []
  $http.get({
    url: "https://games.mobileapi.hupu.com/3/7.1.18/" + gametype + "/getGames?time_zone=Asia%2FShanghai&direc=next&client=cbf23a9fe5297e062f92690a7ed26af3c6647078&night=0&crt=1525160359&advId=68388FF5-D314-42F2-9B5B-B66FC782C857&clientId=35294508&sign=1801bb7c73ba11266d2db1ec1bbb37db&preload=0",
    header: {
      "Accept-Encoding": "gzip",
      "Connection": "keep-alive",
      "Cookie": "cpck=eyJwcm9qZWN0SWQiOiIzIiwiY2xpZW50IjoiY2JmMjNhOWZlNTI5N2UwNjJmOTI2OTBhN2VkMjZhZjNjNjY0NzA3OCIsImlkZmEiOiI2ODM4OEZGNS1EMzE0LTQyRjItOUI1Qi1CNjZGQzc4MkM4NTcifQ==; __dacevid3=0x77ff9195c945e6ea; cid=35294508",
      "Host": "games.mobileapi.hupu.com",
      "Proxy-Connection": "keep-alive",
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Mobile/14G60 isp/460.02 network/WIFI prokanqiu/7.1.18.55 iPhone8,4"
    },
    handler: function (resp) {

      render(resp)

    }
  })

  // Main program
  function render(resp) {
    var data = resp.data

    console.log(data)
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

    for (var kk = 0; kk < gameDataArr.length; kk++) { //games[0],games[1]就是不同天

      var toDayList = gameDataArr[kk].data; //当天比赛数据
      var dayForScrollLocation = gameDataArr[kk].day;

      var dayForScrollLocation_section = kk;

      if (dayForScrollLocation >= currentDate) {

        //arrDayForScrollLocation.push(dayForScrollLocation)

        arrDayForScrollLocation_section.push(dayForScrollLocation_section)

        //console.log(arrDayForScrollLocation_section)
      }

      var dateblockForSectionTitle = gamesList[kk].date_block;

      // console.log(toDayList);

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

        if (toDayList[i].home_name == "精彩瞬间" || toDayList[i].home_name == "疯狂竞猜" || toDayList[i].away_name == "路人王" || toDayList[i].home_name == "虎扑") {

          // console.log("非比赛，无关的")

        } else {
          obj.teams.text = toDayList[i].home_name + " : " + toDayList[i].away_name;
          obj.onewinscore.text = toDayList[i].home_score.toString();
          obj.twowinscore.text = toDayList[i].away_score.toString();

          obj.gidUrl = toDayList[i].gid.toString();
          obj.isOver.text = toDayList[i].process;
          obj.content.text = toDayList[i].match_type;

          //obj.content.text = toDayList[i].type_block;
          objOneDay_Rows.push(obj); //$$$
        }

      }
      rowToDayList.push(elementOneDay); //$$$2   https://segmentfault.com/q/1010000006791550  https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=push%E4%B9%8B%E5%90%8E%E5%8F%98%E6%88%90%E4%BA%86%E5%AD%97%E7%AC%A6%E4%B8%B2&oq=var%2520obj%2520%253D%2520%257B%257D%253B&rsv_pq=ec9d6f200001157f&rsv_t=bbd2CJwpyWLaqOSlTgiJcZvCannCBgnlH0q%2FKjDoOoUnbPx5oU9S5mzIXH4&rqlang=cn&rsv_enter=1&inputT=8775&rsv_sug3=66&rsv_sug1=27&rsv_sug7=100&rsv_sug2=0&rsv_sug4=8775

    }

    console.log(rowToDayList)

    $ui.render({

      views: [{
        type: "list",
        props: {
          id: "listid",
          grouped: true,
          rowHeight: 70, // 行高
          header: {
            type: "label",
            props: {
              height: 0,
              text: "NBA赛程板", // headerDateTip,
              textColor: $color("#AAAAAA"),
              align: $align.center,
              font: $font(14)
            }
          },

          template: [{
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
              id: "teams", // 队伍
              font: $font(20)
            },
            layout: function (make, view) {
              make.centerX.equalTo(0)
              make.top.equalTo(18)
              // make.left.equalTo(160)
              // make.top.right.inset(8)
              make.height.equalTo(24)
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
              id: "onewinscore", // 一队比分
              textColor: $color("#888888"),
              font: $font(20)
            },
            layout: function (make) {
              // make.left.inset(28)
              make.right.equalTo($("teams").centerX).offset(-110) //距离队伍的偏移量
              make.top.inset(10)
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
              make.top.inset(10)
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
            var row = indexPath.row; // 目前这里不对
            console.log(row)
            var section = indexPath.section;
            console.log(section)
            //var scheduleid = rowToDayList(section,row).gidUrl;

            var gidUrl = rowToDayList[section].rows[row].gidUrl;
            console.log(gidUrl)
            $ui.push({
              props: {
                title: rowToDayList[section].rows[row].teams.text
              },
              views: [{
                type: "web",
                props: {
                  url: "https://m.hupu.com/" + gametype + "/game/recap_" + gidUrl + ".html"
                },
                layout: $layout.fill,
              }]
            })

          }
        }
      }

      ]
    })
    if (gameDataArr.list == false) {
      return $ui.toast("无数据");
    }

    var scrollSection = arrDayForScrollLocation_section[0] - 1;
    $("listid").scrollTo({
      indexPath: $indexPath(scrollSection, 0),
      animated: true // 默认为 true
    })

  }
}