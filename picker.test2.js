$ui.render({
    props: {
        id: "uiRender1",
        title: "Hello, uiRender!"
    },
    views: [{
        type: "picker",
        props: {
            items: [
                {
                    title: "Language"
                },
                {
                    title: "Framework"
                },
                {
                    title: "Framework"
                }
            ]
        },
        layout: function (make) {
            make.left.top.right.equalTo(0)
        },
        events: {
            changed: function (sender) {
                console.log(sender.data)
            }
        }
    }]
})



$pick.data({
    props: {
        items: [
            ["1"],
            ["A"],
            ["!"]
        ]
    },
    handler: function (data) {
        $ui.alert({
            title: "Data",
            message: data
        })
    }
})