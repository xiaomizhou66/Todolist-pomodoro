//index.js
//获取应用实例
const app = getApp() //这里可以理解为实例化app.js，就引进了app.js了，
//可以使用app.js中的自定义方法与属性了，使用方式`app.xxx`点属性来调用
//const与 var 区别
const util = require('../../utils/util.js')
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    listtypes: ["工作", "购物", "其他"], //输入框分类
    typeIndex: 0, //分类索引
    inputvalue: '', //输入框输入内容
    todolist: [], //待办列表
    tabs: ["工作", "购物", "其他"], //tabs导航头
    activeIndex: 0, //激活tab
    sliderOffset: 0,
    sliderLeft: 0
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  onShow: function () {
    this.gettodolist(); //获取列表数据
  },
  //列表切换方法
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      typeIndex: e.currentTarget.id
    });
  },
  /* 输入框类型选择 */
  bindlisttypeChange: function (e) {
    this.setData({
      typeIndex: e.detail.value
    })
  },
  //输入内容
  bindInput: function (e) {
    this.setData({
      inputvalue: e.detail.value
    })
  },
  //确认时候绑定事件，电脑可以直接是enter键
  bindConfirm: function (e) {
    //构造待办列表对象
    //var startAt=new Date().Format("yyyy-MM-dd hh:mm:ss"); 
    // Format() 是app.js 我们全局 为 Date 类型添加的 格式化处理函数
    // formatTime 是 util 工具包里面的处理时间格式的函数
    var startAt = util.formatTime(new Date(), "yyyy-MM-dd hh:mm:ss")
    var newTodo = {
      title: e.detail.value,
      //title:this.inputvalue,这样是错误的，每次得到的是空的数据，
      //因为需要设置确认之后输入框的inputvalue内容为空。
      isFinish: false,
      startAt: startAt,
      typeIndex: this.data.typeIndex //输入事项的分类
    }
    this.data.todolist.push(newTodo)
    this.savetodolist();
    this.setData({
      todolist: this.data.todolist,
      inputvalue: ''
    })
  },
  //完成待办
  changeFinish: function (e) {
    //修改对象数组中的某个数值，this.setData({})里面是键值对的形式来写的，
    //那么我们用todolist[index].isFinish这样是不行的，先将这个key构造出来，然后用[]括起来，
    //就可以改写值了
    //构造的变量直接是data下的属性加上它后面的字符串，不要写成this.data.xxx
    //'todolist[' + e.currentTarget.dataset.index + '].isFinish'这样才是对的
    var index = e.currentTarget.dataset.index
    var isFinishChange = 'todolist[' + index + '].isFinish'
    this.setData({
      [isFinishChange]: true,
    })
    this.savetodolist();
  },
  //将todolist保存到缓存中
  savetodolist: function () {
    wx.setStorage({
      key: 'todolist',
      data: this.data.todolist
    })
  },
  //从缓存获取数据
  gettodolist: function () {
    var that = this
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