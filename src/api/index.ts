import { get, post } from './HTTPAdapter'
const base = 'api'

// export const recommendUrl = 'https://3g.163.com/fe/api/hot/news/list?limit=5&origin=baidu&from=wap3g'
// export const recommendUrl = 'http://3g.163.com/touch/nc/api/user/recommend/GuessLike/1-10-10-10.do?__rnd=7007793&callback=recommendList'
export const hotUrl = 'http://3g.163.com/fe/api/hot/news/flow' // 热点新闻

export const getHostNews = (params: any) => {
    return get(`${base}?key=wy&url=${hotUrl}`, params)
}
