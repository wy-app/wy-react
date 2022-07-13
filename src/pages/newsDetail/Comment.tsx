import { memo, useRef, useState, useEffect } from 'react'
import { getCommentsHotList, getCommentsNewList } from '@/api'
import { /* BrowserRouter as Router, Switch, useParams,  */ useLocation, useNavigate } from 'react-router-dom'
import './detail.scss'
import { Flex, NoticeBar, Empty, List, Image, Loading, NavBar, Sticky } from 'react-vant'
import RenderList from './RenderList'

function Comment (props: any) {
  const navigate = useNavigate()
  const localtion = useLocation()
  const { docid } = localtion.state as any
  if (!docid) return <Empty description="暂无数据" />
  const [hotCommentMap, setHotCommentMap] = useState({} as any)
  const [newCommentMap, setNewCommentMap] = useState({} as any)
  const [hotIds, setHotIds] = useState([] as any)
  const [newIds, setNewIds] = useState([] as any)
  const [finished, setFinished] = useState(false)
  const [offset, setOffset] = useState(0)

  // 请求数据
  const getHotList = async () => {
    const res: any = await getCommentsHotList({ callback: 'callback_fyz' }, { docid: docid })
    if (!res) return
    const matchArr = res.match(/callback_fyz\((.*)\)/)
    const resultStr = JSON.parse(matchArr[1])
    const data = JSON.parse(resultStr)
    console.log(data)
    setHotCommentMap(data.comments)
    setHotIds(data.commentIds)
  }
  const onLoad = async () => {
    const res: any = await getCommentsNewList({ callback: 'callback_fyz' }, { docid, offset })
    if (!res) return
    const matchArr = res.match(/callback_fyz\((.*)\)/)
    const resultStr = JSON.parse(matchArr[1])
    const data = JSON.parse(resultStr)
    console.log(data)
    setNewCommentMap(Object.assign(newCommentMap, data.comments))
    setNewIds(newIds.concat(data.commentIds))
    if (offset + 10 > data.newListSize) {
      setFinished(true)
      return
    }
    setOffset(offset + 5)
    console.log(offset)
  }

  useEffect(() => {
    console.log(['docid', docid])
    if (docid) {
      const timeout = setTimeout(() => {
        getHotList()
        onLoad()
      })
      return () => clearTimeout(timeout)
    }
  }, [docid])

  const goBack = () => {
    navigate('/detail', {
      state: { id: docid }
    })
  }

  return (
    <>
      <Sticky {...props}>
        <NavBar title="" leftText="返回" onClickLeft={() => goBack()} />
      </Sticky>
      <List className='data-list' finished={finished} errorText="请求失败，点击重新加载" onLoad={onLoad} offset={100} immediateCheck={false} finishedText="-我也是有底线的-">
        <div className='comment-wrap' >
          {
            hotIds.length
              ? <>
                <NoticeBar color="#f44336" background="#fff">热门跟帖</NoticeBar>
                {/* {renderList(hotIds, hotCommentMap)} */}
                <RenderList ids={hotIds} commentMap={hotCommentMap}></RenderList>
              </>
              : ''
          }
          {
            newIds.length
              ? <>
                <NoticeBar color="#f44336" background="#fff">最新跟帖</NoticeBar>
                {/* {renderList(newIds, newCommentMap)} */}
                <RenderList ids={newIds} commentMap={newCommentMap}></RenderList>
              </>
              : ''
            // <Loading className='pageLoading' type="ball" />
          }
        </div>
      </List>
    </>
  )
}

export default memo(Comment)
