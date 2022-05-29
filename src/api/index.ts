import { get, post } from './HTTPAdapter'
const base = 'api'

// export const recommendUrl = 'https://3g.163.com/fe/api/hot/news/list?limit=5&origin=baidu&from=wap3g'
// export const recommendUrl = 'http://3g.163.com/touch/nc/api/user/recommend/GuessLike/1-10-10-10.do?__rnd=7007793&callback=recommendList'
const hotUrl = 'http://3g.163.com/fe/api/hot/news/flow' // 热点新闻
const index_original = 'http://3g.163.com/touch/api/pagedata/index_original'
const hotWord = 'http://gw.m.163.com/search/api/v1/pc-wap/hot-word'
const searchApi = 'http://gw.m.163.com/search/api/v1/pc-wap/sug'
const searchDetail = 'http://c.m.163.com/fe/api/search/query'
const detailAPi = `http://c.m.163.com/nc/article/docid/full.html`

export const getHostNews = (params: any) => {
  return get(`${base}?key=wy&url=${hotUrl}`, params)
}

export const getOriginalNews = (params: any) => {
  return get(`${base}?key=wy&url=${index_original}`, params)
}

export const getHotWord = (params: any) => {
  return get(`${base}?key=wy&url=${hotWord}`, params)
}

export const getSearch = (params: any, obj: any) => {
  let str = ''
  for (const key in obj) {
    str += `${key}=${obj[key]}&`
  }
  return get(`${base}?key=wy&url=${encodeURIComponent(`${searchApi}?${str}`)}`, params)
}

export const getSearchDetailList = (params: any, obj: any) => {
  let str = ''
  for (const key in obj) {
    str += `${key}=${obj[key]}&`
  }
  return get(`${base}?key=wy&url=${encodeURIComponent(`${searchDetail}?${str}`)}`, params)
}

export const getDetailData = (params: any, obj: any) => {
  const url = detailAPi.replace('docid', obj.docid)
  return get(`${base}?key=wy&url=${encodeURIComponent(`${url}`)}`, params)
}
