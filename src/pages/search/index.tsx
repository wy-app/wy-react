import { memo, useRef, useState, useEffect } from 'react'
import type { ListInstance } from 'react-vant';
import { getHotWord, getSearch, getSearchDetailList } from '@/api'
import { Cell, List, Empty, Search, Image, Loading, Sticky } from 'react-vant'
import './index.scss'
import { /* BrowserRouter as Router, Switch, useParams, useLocation, */ useNavigate } from 'react-router-dom'
import { Search as SearchIcon } from '@react-vant/icons'
import { newsItem } from '../../types/news'
import ListItem from '../../components/ListItem'

function SearchPage (props: any) {
  const listRef = useRef<ListInstance>(null)
  const [entranceInfo, setEntranceInfo] = useState({} as any)
  const [dataList, setDataList] = useState([] as any)
  const [searchList, setSearchList] = useState([] as any)
  const [detailList, setDetailList] = useState([] as any)
  const [finished, setFinished] = useState(false)
  const [isLoding, setIsLoding] = useState(false)
  const [status, setStatus] = useState('default')
  const [vauge, setVauge] = useState('');
  const navigate = useNavigate()

  // 请求数据
  const onLoad = async () => {
    const res: any = await getHotWord({ callback: 'callback_fyz' })
    if (!res) return
    const matchArr = res.match(/callback_fyz\((.*)\)/)
    const resultStr = JSON.parse(matchArr[1])
    const { data } = JSON.parse(resultStr)
    console.log(data)
    setDataList(data.hotWordList)
    setEntranceInfo(data.entranceInfo)
    setFinished(true)
  }
  // 模糊匹配搜索
  const onSearch = async (e: any) => {
    if (!e) {
      setStatus('default')
      return
    }
    setVauge(e)
    setStatus('keyword')
    const res: any = await getSearch({ callback: 'callback_fyz' }, { query: e })
    if (!res) return
    const matchArr = res.match(/callback_fyz\((.*)\)/)
    const resultStr = JSON.parse(matchArr[1])
    const { data } = JSON.parse(resultStr)
    console.log(data)
    setSearchList(data.text)
  }
  // 清空搜索
  const onClear = () => {
    setVauge('')
    setStatus('default')
  }
  // 点击查完整搜索：精确搜索
  const searchDetail = (query: string) => {
    setStatus('detail')
    const word = query.replace('<em>', '').replace('</em>', '')
    setVauge(word)
    setIsLoding(true)
    setDetailList([])
    getSearchDetailList({ callback: 'callback_fyz' }, { query: word, page: 0, size: 20, from: 'wap', needPcUrl: true })
      .then((res: any) => {
        if (!res) return
        const matchArr = res.match(/callback_fyz\((.*)\)/)
        const resultStr = JSON.parse(matchArr[1])
        const { data } = JSON.parse(resultStr)
        console.log(data)
        setDetailList(data.result)
      }).finally(() => {
        setIsLoding(false)
      })
  }
  // 取消搜索
  const onCancel = () => {
    if (status === 'default') {
      navigate('/')
    } else {
      setStatus('default')
    }
  }

  // 渲染模糊匹配搜索列表
  const renderRow = (row: any, i: number) => {
    return (
      <Cell {...props} className='search-cell' valueClass="search-value" key={i} value={`${row.exp}`} onClick={() => { searchDetail(row.searchWord) }}>
        <div className='search-item'>
          <span className={`No rank-${i + 1}`}>{(i === 0 || i === 1 || i === 2) ? '' : i + 1}</span>
          <div className='title'>
            {row.hotWord}
            {
              row.tag === 'Boil'
                ? <div className='tag-Boil'>沸</div>
                : row.tag === 'Hot'
                  ? <div className='tag-Hot'>热</div>
                  : row.tag === 'New'
                    ? <div className='tag-New'>新</div>
                    : null
            }
          </div>
          <div className='exp'>{(row.exp / 10000).toFixed(1) + '万'}</div>
        </div>
      </Cell>
    )
  }

  const toDetail = (docid: string) => {
    navigate('/detail', {
      state: { id: docid }
    })
  }

  // 渲染精确匹配搜索列表
  const renderItem = (row: newsItem, i: number) => {
    if (row.imgurl && row.imgurl.length) {
      return (
        <Cell {...props} className='detail-row' key={i} icon={<Image fit="cover" width={120} height={80} src={row.imgurl[0]} />} onClick={() => toDetail(row.docid)}>
          <div className='content'>
            <div className='title' dangerouslySetInnerHTML={{ __html: row.title }}></div>
            <div className='tag' >{`${row.source} \t ${row.ptime ? row.ptime.slice(0, -3) : ''}`}</div>
          </div>
        </Cell>
      )
    } else {
      return (
        <Cell {...props} className='detail-row' key={i} onClick={() => toDetail(row.docid)}>
          <div className='content'>
            <div className='title' dangerouslySetInnerHTML={{ __html: row.title }}></div>
            <div className='tag' >{`${row.tag || ''} ${row.source} \t ${row.ptime ? row.ptime.slice(0, -3) : ''}`}</div>
          </div>
        </Cell >
      )
    }
  }

  return (
    <div className='search-page'>
      <Sticky {...props}>
        <Search className='search-head' shape="round" background="#fff" value={vauge} onChange={onSearch} onClear={onClear} placeholder="请输入搜索关键词" showAction onCancel={onCancel} />
      </Sticky>
      {
        isLoding ? <Loading type="ball" /> : null
      }
      {
        status === 'default'
          ? <>
            <div className='search-banner'>
              <Image className='logoPic' height="15" src={entranceInfo.logoPic}></Image>
              <Image className='sloganPic' height="20" src={entranceInfo.sloganPic}></Image>
              <div className='s-tip'>每30分钟更新</div>
            </div>
            <List className='search-list' ref={listRef} finished={finished} errorText="请求失败，点击重新加载" onLoad={onLoad}>
              {dataList.length
                ? dataList.map((row: any, i: number) => {
                  return renderRow(row, i)
                })
                : <Empty description="暂无数据" />}
            </List>
          </>
          : status === 'keyword'
            ? <div className='search-filter'> {
              searchList.length
                ? searchList.map((e: any, i: number) => {
                  return (
                    <Cell {...e} key={i} icon={<SearchIcon />} onClick={() => { searchDetail(e.suggestion) }}>
                      <div dangerouslySetInnerHTML={{ __html: e.suggestion }}></div>
                    </Cell>
                  )
                })
                : <Empty description="暂无数据" />
            }</div>
            : status === 'detail'
              ? <div className='detail-wrap'>
                {
                  detailList.length
                    ? detailList.map((e: any, i: number) => {
                      return renderItem(e, i)
                    })
                    : <Empty description="暂无数据" />
                }
              </div>
              : <Empty description="暂无数据" />
      }
    </div>
  )
}

export default memo(SearchPage)
