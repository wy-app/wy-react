import { useRef, useState, useEffect } from 'react'
import type { ListInstance } from 'react-vant'
import { getHostNews } from '@/api'
import { Cell, List, Empty, Image, PullRefresh } from 'react-vant'
import './index.scss'
import { newsItem } from '../../types/news'
import ListItem from '../../components/ListItem'

export default function HotList () {
  const listRef = useRef<ListInstance>(null)
  const [dataList, setDataList] = useState([] as any)
  const [finished, setFinished] = useState(false)

  const onLoad = async () => {
    const res: any = await getHostNews({ callback: 'callback_fyz' })
    if (!res) return
    const matchArr = res.match(/callback_fyz\((.*)\)/)
    const resultStr = JSON.parse(matchArr[1])
    const resultJson = JSON.parse(resultStr)
    const list = resultJson.data.list
    console.log(resultJson)
    setDataList((v: any) => [...v, ...list])
    if (dataList.length >= 30) {
      setFinished(true)
    }
  }
  const onRefresh = async () => {
    setFinished(false)
    await onLoad()
    listRef.current?.check()
  }

  return (
    <>
      <PullRefresh successText="刷新成功" onRefresh={onRefresh}>
        <List className='data-list' ref={listRef} finished={finished} errorText="请求失败，点击重新加载" onLoad={onLoad}>
          {dataList.length
            ? dataList.map((row: any, i: number) => {
              return <ListItem data={row} key={i} activeTab="hot"></ListItem>
            })
            : <Empty description="暂无数据" />}
        </List>
      </PullRefresh>
    </>
  )
}
