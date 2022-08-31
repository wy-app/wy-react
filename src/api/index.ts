import { get, post } from './HTTPAdapter'
const base = 'api'

// export const recommendUrl = 'https://3g.163.com/fe/api/hot/news/list?limit=5&origin=baidu&from=wap3g'
// export const recommendUrl = 'http://3g.163.com/touch/nc/api/user/recommend/GuessLike/1-10-10-10.do?__rnd=7007793&callback=recommendList'
const hotUrl = 'http://3g.163.com/fe/api/hot/news/flow' // 热点新闻
const index_original = 'http://3g.163.com/touch/api/pagedata/index_original' // 原创
const hotWord = 'http://gw.m.163.com/search/api/v1/pc-wap/hot-word' // 搜索默认推荐列表
const searchApi = 'http://gw.m.163.com/search/api/v1/pc-wap/sug' // 模糊搜索标题
const searchDetail = 'http://c.m.163.com/fe/api/search/query' // 精确搜索字段结果
const detailAPi = 'http://c.m.163.com/nc/article/docid/full.html' // 详情
// 推荐 http://c.m.163.com/nc/article/headline/T1348647853363/0-20.html
// 娱乐 http://c.3g.163.com/nc/article/list/T1348648517839/0-20.html
const recommendAPi = 'http://c.m.163.com/nc/article/list/T1348648517839/PageRange.html'
const rollingAPi = 'http://gw.m.163.com/search/api/v1/pc-wap/rolling-word'
// 热门评论
const comments_hotList = 'http://comment.api.163.com/api/v1/products/a2869674571f77b5a0867c3d71db5856/threads/DOCID/comments/hotList?offset=0&limit=5&headLimit=3&tailLimit=2&ibc=newswap&showLevelThreshold=5'
// 最新评论
const comments_newList = 'http://comment.api.163.com/api/v1/products/a2869674571f77b5a0867c3d71db5856/threads/DOCID/comments/newList?offset=OFFSET&limit=5&headLimit=3&tailLimit=2&ibc=newswap&showLevelThreshold=5&callback=callback_1655710210922'

export const getHostNews = (callbackObj: any) => {
  return get(`${base}?key=wy&url=${hotUrl}`, callbackObj)
}

export const getOriginalNews = (callbackObj: any) => {
  return get(`${base}?key=wy&url=${index_original}`, callbackObj)
}

export const getHotWord = (callbackObj: any) => {
  return get(`${base}?key=wy&url=${hotWord}`, callbackObj)
}

export const getRollingWord = (callbackObj: any) => {
  return get(`${base}?key=wy&url=${rollingAPi}`, callbackObj)
}

export const getSearch = (callbackObj: any, params: any) => {
  let str = ''
  for (const key in params) {
    str += `${key}=${params[key]}&`
  }
  return get(`${base}?key=wy&url=${encodeURIComponent(`${searchApi}?${str}`)}`, callbackObj)
}

export const getSearchDetailList = (callbackObj: any, params: any) => {
  let str = ''
  for (const key in params) {
    str += `${key}=${params[key]}&`
  }
  return get(`${base}?key=wy&url=${encodeURIComponent(`${searchDetail}?${str}`)}`, callbackObj)
}

export const getDetailData = (callbackObj: any, params: any) => {
  const url = detailAPi.replace('docid', params.docid)
  return get(`${base}?key=wy&url=${encodeURIComponent(`${url}`)}`, callbackObj)
}

export const getRecommendNews = (callbackObj: any, params: any) => {
  const { currentPage, pageSize } = params
  const pageRange = `${(currentPage - 1) * pageSize}-${currentPage * pageSize}`
  return get(`${base}?key=wy&url=${recommendAPi.replace('PageRange', pageRange)}`, callbackObj)
}

export const getCommentsHotList = (callbackObj: any, params: any) => {
  // const { currentPage, pageSize } = params
  // const pageRange = `${(currentPage - 1) * pageSize}-${currentPage * pageSize}`
  return get(`${base}?key=wy&url=${comments_hotList.replace('DOCID', params.docid)}`, callbackObj)
}
export const getCommentsNewList = (callbackObj: any, params: any) => {
  const { offset, docid } = params
  return get(`${base}?key=wy&url=${comments_newList.replace('DOCID', docid).replace('OFFSET', params.offset)}`, callbackObj)
}
