// pages/pomodoro/pomodoro.js
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    workTime: 30, //工作时间
    restTime: 5, //休息时间
    leftDeg: 45, //左圆角度
    rightDeg: -45, //右圆角度
    WremainTimeText: '', //倒计时时间
    RremainTimeText: '', //倒计时时间
    WisRuning: false, //任务是否正在执行
    RisRuning: false, //休息是否正在执行
    inputtext: '', //输入框文字
    taskName: '', //任务文字，输入框确认之后的文字
    nameAnimation: null, //任务动画
    log: {} //本次任务记录
  },
  onShow: function () { //页面显示/切入前台时触发。获取设置页面设置的时间
    let workTime = util.formatClock(wx.getStorageSync('workTime'), 'HH')
    let restTime = util.formatClock(wx.getStorageSync('restTime'), 'HH')
    this.setData({
      workTime: workTime,
      restTime: restTime,
      workRemainTimeText: workTime + ':00', //工作时间显示
      restRemainTimeText: workTime + ':00' //休息时间显示
    })
  },
  //文本输入
  inputText: function (e) {
    this.setData({
      inputtext: e.detail.value
    })
  },
  //输入完成绑定的事件函数：开始倒计时
  confirmInputText: function (e) {
    this.setData({
      WisRuning: true //点击确认，改变工作的运行状态为true
    })
    let startTime = Date.now() //获取创建任务开始运行的那个时间值
    //Date.now() 方法返回自1970年1月1日00:00:00 UTC到当前时间的毫秒数，为了做日志用的
    var WisRuning = this.data.WisRuning //一定要将this.setData写在上，不然先写这个赋值获取到的还是false值
    let showWorkTime = this.data.workTime //开始的显示时间
    let keepWorkTime = showWorkTime * 60 * 1000 //运行时长，换算成毫秒
    //let RisRuning = this.data.RisRuning
    let showRestTime = this.data['restTime'] //休息的时间显示，
    let keepRestTime = showRestTime * 60 * 1000 //运行时长，换算成毫秒
    if (WisRuning) { //这里不用this.data.根本无法执行if里面的语句
      //setInterval() 方法可按照指定的周期（以毫秒计）来调用函数或计算表达式。
      //下面指的是没1000ms--每秒执行一次function函数
      this.Wtimer = setInterval((function () {
        this.WupdateTimer() //倒计时
        this.startNameAnimation() //文字闪烁
      }).bind(this), 1000)
    } else {
      this.WstopTimer() //停止计时函数
    }
    //构建log对象
    this.data.log = {
      name: this.data.taskName,
      startTime: Date.now(),
      keepWorkTime: keepWorkTime, //workTime*60*1000
      keepRestTime: keepRestTime, //restTime*60*1000
      workendTime: keepWorkTime + startTime,
      restendTime: keepWorkTime + keepRestTime + startTime
    }
    this.saveLog(this.data.log) //日志存储到缓存
  },
  //时间，倒计时
  WupdateTimer: function () {
    let log = this.data.log
    let now = Date.now()
    let WremainingTime = Math.round((log.workendTime - now) / 1000)
    let WH = util.formatClock(Math.floor(WremainingTime / (60 * 60)) % 24, 'HH')
    let WM = util.formatClock(Math.floor(WremainingTime / (60)) % 60, 'MM')
    let WS = util.formatClock(Math.floor(WremainingTime) % 60, 'SS')
    let WhalfTime
    // 文本倒计时
    if (WremainingTime > 0) {
      let WremainTimeText = (WH === "00" ? "" : (WH + ":")) + WM + ":" + WS
      this.setData({
        WremainTimeText: WremainTimeText
      })
    } else if (WremainingTime == 0) {
      this.setData({
        WisRuning: false,
        RisRuning: true
      })
      this.WstopTimer()
      if (this.data.RisRuning) { //这里不用this.data.根本无法执行if里面的语句
        //setInterval() 方法可按照指定的周期（以毫秒计）来调用函数或计算表达式。
        //下面指的是没1000ms--每秒执行一次function函数
        const BackgroundAudioManager = wx.getBackgroundAudioManager()
        BackgroundAudioManager.src = 'http://pdehao3yf.bkt.clouddn.com/%E9%99%88%E5%A5%95%E8%BF%85%20-%20%E5%8D%81%E5%B9%B4%20-%20%E4%BC%B4%E5%A5%8F%20%E9%93%83%E5%A3%B0.mp3'
        this.Rtimer = setInterval((function () {
          this.RupdateTimer() //倒计时
          //this.startNameAnimation() //文字闪烁
        }).bind(this), 1000)
      } else {
        this.RstopTimer() //停止计时函数
      }
      //return
    }
    // 圆倒计时
    WhalfTime = log.keepWorkTime / 2
    if ((WremainingTime * 1000) > WhalfTime) {
      this.setData({
        leftDeg: 45 - (180 * (now - log.startTime) / WhalfTime)
      })
    } else {
      this.setData({
        leftDeg: -135,
        rightDeg: -45 - (180 * (now - (log.startTime + WhalfTime)) / WhalfTime)
      })
    }
  },
  RupdateTimer: function () {
    let log = this.data.log
    let now = Date.now()
    let RremainingTime = Math.round((log.restendTime - now) / 1000)
    let RH = util.formatClock(Math.floor(RremainingTime / (60 * 60)) % 24, 'HH')
    let RM = util.formatClock(Math.floor(RremainingTime / (60)) % 60, 'MM')
    let RS = util.formatClock(Math.floor(RremainingTime) % 60, 'SS')
    let RhalfTime
    // 文本倒计时
    if (RremainingTime > 0) {
      let RremainTimeText = (RH === "00" ? "" : (RH + ":")) + RM + ":" + RS
      this.setData({
        RremainTimeText: RremainTimeText
      })
    } else if (RremainingTime == 0) {
      this.setData({
        RisRuning: false, //当RremainingTime == 0，休息就完成了，将值设置为true
        RremainTimeText: ''
      })
      this.RstopTimer()
      return
    }
    RhalfTime = log.keepRestTime / 2
    if ((RremainingTime * 1000) > RhalfTime) {
      this.setData({
        rightDeg: -225 + (180 * (now - log.keepWorkTime - log.startTime) / RhalfTime)
      })
    } else {
      this.setData({
        rightDeg: -45,
      })
      this.setData({
        leftDeg: -135 + (180 * (now - (log.startTime + log.keepWorkTime + RhalfTime)) / RhalfTime)
      })
    }
  },
  //任务文字闪烁
  startNameAnimation: function () {
    let animation = wx.createAnimation({
      duration: 450
    })
    animation.opacity(0.2).step()
    animation.opacity(1).step()
    this.setData({
      nameAnimation: animation.export()
    })
  },
  //停止计时
  WstopTimer: function () {
    // reset circle progress
    this.setData({
      leftDeg: -135,
      rightDeg: -225
    })
    // clear timer
    this.Wtimer && clearInterval(this.Wtimer)
    //setInterval() 函数会每秒执行一次函数，类似手表)。使用 clearInterval() 来停止执行:
  },
  //停止计时
  RstopTimer: function () {
    // reset circle progress
    this.setData({
      leftDeg: 45,
      rightDeg: -45,
      inputtext: ''
    })
    // clear timer
    this.Rtimer && clearInterval(this.Rtimer)
    //setInterval() 函数会每秒执行一次函数，类似手表)。使用 clearInterval() 来停止执行:
  },
  //保存日志
  saveLog: function (log) {
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(log)
    wx.setStorageSync('logs', logs)
  }
})