// pages/history/history.js
//获取应用实例
const app = getApp() //这里可以理解为实例化app.js，就引进了app.js了，
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    typeIndex: 0, //分类索引
    todolist: [], //待办列表
    tabs: ["工作", "购物", "其他"], //tabs导航头
    activeIndex: 0, //激活tab
    sliderOffset: 0,
    sliderLeft: 0
  },
  onShow: function () {
    this.gettodolist()
  },
  //列表切换方法,数据展现筛选
  tabClick: function (e) {
    this.gettodolist()
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });    
  },
  //删除列表项
  remove: function (e) {
    var index = e.currentTarget.dataset.index
    this.data.todolist.splice(index, 1);
    this.setData({
      todolist: this.data.todolist
    })
    console.log(2,this.data.todolist)
    this.savetodolist()
  },
  //将todolist保存到缓存中
  savetodolist: function () {
    wx.setStorage({
      key: 'todolist',
      data: this.data.todolist
    })
    console.log(1,this.data.todolist)
  },
  gettodolist: function () {
    var that=this//为什么这里使用的是that，不能直接使用this？？？函数的局部作用域？
    wx.getStorage({
      key: 'todolist',
      success: function (res) {
        that.setData({
          todolist: res.data
        })
      }
    })
  }
})