//app.js注册一个小程序js文件
//App() 函数用来注册一个小程序。接受一个 Object 参数，其指定小程序的生命周期回调等。
//App() 必须在 app.js 中调用，必须调用且只能调用一次。不然会出现无法预期的后果。
const defaultTime = { //番茄钟变量
  defaultWorkTime: 25,
  defaultRestTime: 5
}
App({
  onLaunch: function () { //生命周期回调—监听小程序初始化	小程序初始化完成时（全局只触发一次）
    //小程序版本更新
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })
    var logs = wx.getStorageSync('logs') || [] // 展示本地存储能力，调用API从本地缓存中获取数据
    // Date.now() 方法返回自1970年1月1日00:00:00 UTC到当前时间的毫秒数。
    //unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度。
    logs.unshift(Date.now()) //把当前时间添加到数据logs中
    wx.setStorageSync('logs', logs) //调用API重新保存/设置本地数据缓存
    // 登录
    wx.login({ //授权登录，小程序可以通过微信官方提供的登录能力方便地获取微信提供的用户身份标识，快速建立小程序内的用户体系。
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
      fail: res => {
        console.log('error')
      }
    })
    // 获取用户信息
    wx.getSetting({ //获取用户的当前设置。 注：返回值中只会出现小程序已经向用户请求过的权限
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo //用户信息，赋值给全局数据globalData的属性userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    //番茄钟方法
    let workTime = wx.getStorageSync('workTime')
    let restTime = wx.getStorageSync('restTime')
    if (!workTime) {
      wx.setStorage({
        key: 'workTime',
        data: defaultTime.defaultWorkTime
      })
    }
    if (!restTime) {
      wx.setStorage({
        key: 'restTime',
        data: defaultTime.defaultRestTime
      })
    }
    //new Date 对象时间格式处理
    Date.prototype.Format = function (fmt) { //author: meizz 
      var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    }
  },
  globalData: { //全局数据
    userInfo: null,
    Date: new Date
  }
})