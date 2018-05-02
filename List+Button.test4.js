// indexPath 和 index 可选其一，value 要符合 data 元素的定义
//$("listaaa").insert({
//  indexPath: $indexPath(0, 0),
//  value: "aaa!"
//})

var rowsData = [{
  title: "Section 1",
  rows: ["1", "2", "3"]
},
{
  title: "Section 2",
  rows: ["4", "5", "6"]
}]

var rowsDataAll =[]

var rowsData1 = {
  title: "Section 1",
  rows: ["1", "2", "3"]
}

var rowsData2 = {
  title: "Section 2",
  rows: ["4", "5", "6"]
}


rowsDataAll.push(rowsData1)
rowsDataAll.push(rowsData2)
console.log(rowsDataAll)



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

        data: rowsData
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