import { useRef, useState, useEffect } from 'react'
import type { ListInstance } from 'react-vant';
import { getOriginalNews } from '@/api'
import { Cell, List, Empty, Image, PullRefresh } from 'react-vant'
import './index.scss'
import { newsItem } from '../../types/news'

export default function HotList () {
  const listRef = useRef<ListInstance>(null)
  const [dataList, setDataList] = useState([] as any)
  const [finished, setFinished] = useState(false)
  const typeMap: any = {
    qsyk: '轻松一刻',
    fd: '沸点工作室',
    rj: '人间工作室',
    lc: '浪潮工作室',
  }

  const onLoad = async () => {
    const res: any = await getOriginalNews({ callback: 'callback_fyz' })
    if (!res) return
    const matchArr = res.match(/callback_fyz\((.*)\)/)
    const resultStr = JSON.parse(matchArr[1])
    const { data } = JSON.parse(resultStr)
    console.log(data)
    const list = []
    for (const key in data) {
      const obj: any = {}
      obj.type = key
      obj.data = data[key]
      if (key === 'list') {
        list.unshift(obj)
      } else {
        list.push(obj)
      }
    }
    setDataList(list)
    setFinished(true)
  }
  const onRefresh = async () => {
    setFinished(false)
    await onLoad()
    listRef.current?.check()
  }

  const renderRow = (item: any) => {
    return (
      <>
        {typeMap[item.type]
          ? <div className='sec-top'>
            <h3 className='title'>{typeMap[item.type]}</h3>
          </div>
          : ''
        }
        {
          item.data.map((row: newsItem, i: number) => {
            if (row.imgsrc3gtype >= 3) {
              return (
                <div className="data-row" key={i} >
                  <div className='new-title'>{row.title}</div>
                  <div className='img-wrap'>
                    {
                      row.picInfo.map((e: any) => <Image width="100" height="200" src={e.url} />)
                    }
                  </div>
                  <div className='detail'>
                    <div className='news-tag'>{row.tag || ''}</div>
                    <div className='news-source'>{row.source || ''}</div>
                    <div className='ptime'>{row.ptime ? row.ptime.slice(0, -3) : ''}</div>
                    <div className='reply'>{row.tcount}跟贴</div>
                  </div>
                </div >
              )
            } else {
              return <Cell className='data-row' titleClass="data-title" key={i} title={`${row.title}`}
                label={`${row.tag || ''}  ${row.source} \t ${row.ptime ? row.ptime.slice(0, -3) : ''} ${row.tcount}跟贴`}
                icon={<Image width={120} height={80} src={row.picInfo[0].url} />}
              />
            }
          })
        }
      </>
    )
  }

  return (
    <>
      <PullRefresh successText="刷新成功" onRefresh={onRefresh}>
        <List className='data-list' ref={listRef} finished={finished} errorText="请求失败，点击重新加载" onLoad={onLoad}>
          {dataList.length
            ? dataList.map((row: any, i: number) => renderRow(row, i))
            : <Empty description="暂无数据" />}
        </List>
      </PullRefresh>
    </>
  )
}
