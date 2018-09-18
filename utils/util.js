//Date 对象处理
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


 //时钟时间处理
function formatClock(time, format) {
  let temp = '0' + time
  let len = format.length
  return temp.substr(-len)
}

//用module.exports 对外暴露接口
module.exports = {
  formatTime:formatTime,//new Date()日期时间处理
  formatClock: formatClock,//番茄钟时间处理
}