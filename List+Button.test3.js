// indexPath 和 index 可选其一，value 要符合 data 元素的定义
//$("listaaa").insert({
//  indexPath: $indexPath(0, 0),
//  value: "aaa!"
//})

var rowToDayList = [{
  title: "Section 0",
  rows: ["0-0", "0-1", "0-2"]
},
{
  title: "Section 1",
  rows: ["1-0", "1-1", "1-2", "9"]
},
{
  title: "section 2",
  rows: ["1-0", "1-1", "1-2"]
},
{
  title: "section 3 星期一",
  rows: ["1-0", "1-1", "1-2"]
}
]





$ui.render({
  views: [

    {
      type: "list",
      props: {
        id: "listaaa",
        rowHight: 68,
        footer: {
          type: "label",
          props: {
            height: 20,
            text: "-我是有底线的-",
            textColor: $color("#AAAAAA"),
            align: $align.center,
            font: $font(12)
          }
        },

        data: rowToDayList
      },
      layout: $layout.fill

      //function(make, view) {
      //make.center.equalTo(view.super)
      //make.width.equalTo(64)
      //make.top.equalTo(0)
      //      }
    },

    {
      type: "button",
      props: {
        title: "Button",
        titleColor: $color("white")
      },
      layout: function (make, view) {
        //make.center.equalTo(view.super)
        //make.width.equalTo(view.super)
        make.left.right.inset(20)
        make.bottom.equalTo(-20)
        make.height.equalTo(40)
      },
      events: {
        tapped: function (sender) {
          $ui.toast("Tapped")
        }
      }
    }

  ]
})


// indexPath 和 index 可选其一，value 要符合 data 元素的定义
// $("listaaa").insert({
//   indexPath: $indexPath(2, 1),
//   value: "Hey!"
// })

// // 未成功
// $("listaaa").insert({
//   indexPath: $indexPath(3, 1),
//   value: "hskskshsh"
// })


// $("listaaa").scrollTo({
//   indexPath: $indexPath(2, 0),
//   animated: true // 默认为 true
// })