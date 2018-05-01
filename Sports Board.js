// 原作者：wlor0623，  https://github.com/wlor0623/jsbox/blob/master/lolscore.js
// 由 QvQ修改： https://github.com/FrankHan/jsbox/blob/master/LOL%20All.js  


// menu 是天，对应于games[0], gamesp[1]，不行：太多天了。必须使用list加section的方法

let appVersion = 1.2


// $app.tips("点击比赛即可查看详情");
var resp = []
$http.get({
  url: "https://games.mobileapi.hupu.com/3/7.1.18/nba/getGames?time_zone=Asia%2FShanghai&direc=next&client=cbf23a9fe5297e062f92690a7ed26af3c6647078&night=0&crt=1525160359&advId=68388FF5-D314-42F2-9B5B-B66FC782C857&clientId=35294508&sign=1801bb7c73ba11266d2db1ec1bbb37db&preload=0",
  header: {
    "Accept-Encoding": "gzip",
    "Connection": "keep-alive",
    "Cookie": "cpck=eyJwcm9qZWN0SWQiOiIzIiwiY2xpZW50IjoiY2JmMjNhOWZlNTI5N2UwNjJmOTI2OTBhN2VkMjZhZjNjNjY0NzA3OCIsImlkZmEiOiI2ODM4OEZGNS1EMzE0LTQyRjItOUI1Qi1CNjZGQzc4MkM4NTcifQ==; __dacevid3=0x77ff9195c945e6ea; cid=35294508",
    "Host": "games.mobileapi.hupu.com",
    "Proxy-Connection": "keep-alive",
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Mobile/14G60 isp/460.02 network/WIFI prokanqiu/7.1.18.55 iPhone8,4"
  },
  handler: function (resp) {
    // resp = resp;


    // ---定位到今天并render
    // var data = resp.data

    // console.log(data)

    // $ui.alert(data)



    render(resp)


  }
})



// Main program
function render(resp) {
  var data = resp.data

  //  console.log(data)
  var currentDate = data.result.days.current; //20180501

  // $ui.alert(currentDate)

  // var rowsData = []; //列表信息
  var gamesList = data.result.games;

  // var date_block = gamesList[0].date_block;
  // $ui.alert(date_block)


  var gamesListIndex = [];
  var gameDataArr = []; //具体数据值

  for (var key in gamesList) {
    gamesListIndex.push(key); // 输出数组下标 0,1,...
    //timeForHeader.push(gamesList[key].day);  // day,date_block
    //console.log(key)  //打印日期
    gameDataArr.push(gamesList[key]);
  }


  // $ui.alert(gameDataArr)





  // console.log(timeArr)

  //var headerDateTip = gameDataArr.lDate; //头部日期提示

  //console.log(headerDateTip)


  // ----！！！ 给rowToDayList赋值
  var rowToDayList = []; //每行比赛数据,用于最终传给list显示！

  // 二维数组初始化  ！！！！好像不行，因为每个天数下的比赛数目不一样。应该：先渲染第一天的数据，后面用list的insert方法插入？？


  // var rowToDayList = new Array();  //先声明一维 
  // for (var k = 0; k < i; k++) {    //一维长度为i,i为变量，可以根据实际情况改变  
  //   rowToDayList[k] = new Array();  //声明二维，每一个一维数组里面的一个元素都是一个数组；  
  //   for (var j = 0; j < p; j++) {   //一维数组里面每个元素数组可以包含的数量p，p也是一个变量；   
  //     rowToDayList[k][j] = "";    //这里将变量初始化，我这边统一初始化为空，后面在用所需的值覆盖里面的值 
  //   }
  // }




  for (var kk = 0; kk < gameDataArr.length; kk++) {//games[0],games[1]就是不同天

    var toDayList = gameDataArr[kk].data; //当天比赛数据

    // console.log(toDayList);




    for (var i = 0; i < toDayList.length; i++) {// 当天的第0,1,2场比赛



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

      obj.title.text = toDayList[i].home_name + " : " + toDayList[i].away_name;
      obj.onewinscore.text = toDayList[i].home_score.toString();
      obj.twowinscore.text = toDayList[i].away_score.toString();

      rowToDayList.push(obj);
    }

  }



  // $ui.alert(rowToDayList)

  // console.log(rowToDayList);
  $ui.render({

    views: [{
      type: "list",
      props: {
        grouped: true,
        rowHeight: 70, // 行高
        header: {
          type: "label",
          props: {
            height: 20,
            text: "test it",// headerDateTip,
            textColor: $color("#AAAAAA"),
            align: $align.center,
            font: $font(14)
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
          // {
          //   type: "label",
          //   props: {
          //     id: "content",
          //     textColor: $color("#888888"),
          //     font: $font(15)
          //   }, // 比赛时间 id content
          //   layout: function (make, view) {
          //     //make.left.right.equalTo(180);

          //     make.top.equalTo(48)

          //     make.centerX.equalTo(0) // 居中 
          //     make.bottom.equalTo(-2)
          //   }
          // },
          {
            type: "label",
            props: {
              id: "onewinscore",// 一队比分
              textColor: $color("#888888"),
              font: $font(25)
            },
            layout: function (make) {
              // make.left.inset(28)
              make.right.equalTo($("title").centerX).offset(-110) //距离队伍的偏移量
              make.top.inset(10)
              make.height.equalTo(40)
            }
          },

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
              make.left.equalTo($("title").centerX).offset(110) //距离队伍的偏移量
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
          //var scheduleid = rowToDayList[row].scheduleid.text;
          //console.log(scheduleid)
          // $app.openBrowser({
          //   type: 10000,
          //   url: "http://www.wanplus.com/schedule/" + scheduleid + ".html"
          // })
        }
      }
    }

    ]
  })
  if (gameDataArr.list == false) {
    return $ui.toast("无数据");
  }
}