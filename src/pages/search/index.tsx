import { useRef, useState, useEffect } from 'react'
import type { ListInstance } from 'react-vant';
import { getHotWord, getSearch } from '@/api'
import { Cell, List, Empty, Search } from 'react-vant'
import './index.scss'
import { newsItem } from '../../types/news'
import { /* BrowserRouter as Router, Switch, useParams, useLocation, */ useNavigate } from 'react-router-dom'

export default function HotList () {
  const listRef = useRef<ListInstance>(null)
  const [dataList, setDataList] = useState([] as any)
  const [finished, setFinished] = useState(false)
  const [vauge, setVauge] = useState('');
  const navigate = useNavigate()

  const onLoad = async () => {
    const res: any = await getHotWord({ callback: 'callback_fyz' })
    if (!res) return
    const matchArr = res.match(/callback_fyz\((.*)\)/)
    const resultStr = JSON.parse(matchArr[1])
    const { data } = JSON.parse(resultStr)
    console.log(data)
    setDataList(data.hotWordList)
    setFinished(true)
  }
  const renderRow = (row: any, i: number) => {
    return <>
      <Cell titleClass="search-title" valueClass="search-value" key={row.title} title={`${i + 1} ${row.hotWord}`} value={`${row.exp}`} isLink />
    </>
  }
  const onChange = async () => {
    const res: any = await getSearch({ callback: 'callback_fyz' }, { query: vauge })
    console.log(res)
  }

  return (
    <>
      <Search className='search' shape="round" background="#fff" value={vauge} onChange={onChange} placeholder="请输入搜索关键词" showAction onCancel={() => navigate('/')} />
      <List className='search-list' ref={listRef} finished={finished} errorText="请求失败，点击重新加载" onLoad={onLoad}>
        {dataList.length
          ? dataList.map((row: any, i: number) => {
            return renderRow(row, i)
          })
          : <Empty description="暂无数据" />}
      </List>
    </>
  )
}
