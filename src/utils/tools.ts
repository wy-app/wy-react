// 评论时间格式转化
export const transformTime = (time: string) => {
  const timestamp = new Date().getTime() - new Date(time).getTime()
  const minutes = timestamp / (1000 * 60)
  if (minutes < 60) {
    return Math.floor(minutes) + '分钟前'
  } else if (minutes / 60 < 24) {
    return Math.floor(minutes / 60) + '小时前'
  } else {
    return Math.floor(minutes / 60 / 24) + '天前'
  }
}
