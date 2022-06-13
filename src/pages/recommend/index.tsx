import { useRef, useState, useEffect } from 'react'
import type { ListInstance } from 'react-vant';
import { getRecommendNews } from '@/api'
import { Cell, List, Empty, Image, PullRefresh } from 'react-vant'
import './index.scss'
import { newsItem } from '../../types/news'
import ListItem from '../../components/ListItem'

export default function RecommendList () {
  const listRef = useRef<ListInstance>(null)
  const [dataList, setDataList] = useState([] as any)
  const [finished, setFinished] = useState(false)

  const onLoad = async () => {
    const res: any = await getRecommendNews({ callback: 'callback_fyz' }, { currentPage: 1, pageSize: 20 })
    if (!res) return
    const matchArr = res.match(/callback_fyz\((.*)\)/)
    const resultStr: any = JSON.parse(matchArr[1])
    const { T1348648517839 } = JSON.parse(resultStr)
    const data = T1348648517839
    console.log(data)
    const list = dataList.concat(data)
    setDataList(list)
    setFinished(true)
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
            ? dataList.map((row: any, i: number) => <ListItem data={row} key={i} activeTab="original"></ListItem>)
            : <Empty description="暂无数据" />}
        </List>
      </PullRefresh>
    </>
  )
}
