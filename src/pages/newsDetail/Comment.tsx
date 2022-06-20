import { memo, useRef, useState, useEffect } from 'react'
import { getCommentsHotList, getCommentsNewList } from '@/api'
import { /* BrowserRouter as Router, Switch, useParams,  */ useLocation, useNavigate } from 'react-router-dom'
import './detail.scss'
import { Flex, NoticeBar, Empty, Search, Image, Loading, NavBar, Sticky, Skeleton, Typography } from 'react-vant'
import { GoodJobO, UserO } from '@react-vant/icons'
import { AnyMxRecord } from 'dns'

function Comment (props: any) {
  const localtion = useLocation()
  const { docid } = localtion.state as any
  console.log(['docid', docid])
  if (!docid) return <Empty description="暂无数据" />
  const [hotCommentMap, setHotCommentMap] = useState({} as any)
  const [newCommentMap, setNewCommentMap] = useState({} as any)
  const [hotIds, setHotIds] = useState([])
  const [newIds, setNewIds] = useState([])
  const navigate = useNavigate()

  // 请求数据
  const onLoad = async () => {
    getCommentsHotList({ callback: 'callback_fyz' }, { docid: docid }).then((res: any) => {
      if (!res) return
      const matchArr = res.match(/callback_fyz\((.*)\)/)
      const resultStr = JSON.parse(matchArr[1])
      const data = JSON.parse(resultStr)
      console.log(data)
      setHotCommentMap(data.comments)
      setHotIds(data.commentIds)
    })
    getCommentsNewList({ callback: 'callback_fyz' }, { docid: docid }).then((res: any) => {
      if (!res) return
      const matchArr = res.match(/callback_fyz\((.*)\)/)
      const resultStr = JSON.parse(matchArr[1])
      const data = JSON.parse(resultStr)
      console.log(data)
      setNewCommentMap(data.comments)
      setNewIds(data.commentIds)
    })
  }

  useEffect(() => {
    if (docid) {
      const timeout = setTimeout(() => onLoad());
      return () => clearTimeout(timeout)
    }
  }, [docid])

  const goBack = () => {
    navigate('/detail', {
      state: { id: docid }
    })
  }
  const insertDom = (dom: any, i, all) => {
    if (all.length - 1 === i) {
      return dom
    } else {
      return insertDom(all[i + 1], i + 1, all)
      // all[i + 1].replace('TemplateDOM', dom)
    }
  }

  const renderList = (idsStringArr: any, commentMap: any) => {
    return (
      <div className='skeleton-wrap'>
        {
          idsStringArr.map((idString: string, index: number) => {
            const ids = idString.split(',')
            const commentArr: any = []
            for (let i = 0; i < ids.length; i++) {
              const id = ids[i]
              if (!commentMap[id]) continue
              // console.log(commentMap[id])
              commentArr.push(
                <Flex className='skeleton-box'>
                  {(commentMap[id].user) ? <img alt="" src={commentMap[id].user.avatar} /> : <UserO />}
                  <div className='skeleton-content'>
                    <Typography.Title>
                      {commentMap[id].user.nickname}
                      <div className='vote-wrap'>
                        {commentMap[id].vote}<GoodJobO className='vote-icon' />
                      </div>
                    </Typography.Title>
                    <Typography.Text >
                      <div dangerouslySetInnerHTML={{ __html: commentMap[id].content }}></div>
                    </Typography.Text>
                    <div>
                      <Typography.Text type="secondary">{commentMap[id].createTime}</Typography.Text>
                    </div>
                  </div>
                </Flex>
              )
            }
            console.log(commentArr)
            return (
              <Skeleton avatar key={index} loading={false} rowHeight={10}>
                {commentArr.map((e: any, i) => {
                  return insertDom(e, i, commentArr)
                })}
              </Skeleton>
            )
          })
        }
      </div>
    )
  }
  return (
    <div className='comment-wrap' >
      {
        hotIds.length || newIds.length
          ? <>
            <Sticky {...props}>
              <NavBar title="" leftText="返回" onClickLeft={() => goBack()} />
            </Sticky>
            <NoticeBar color="#f44336" background="#fff">热门跟帖</NoticeBar>
            {renderList(hotIds, hotCommentMap)}
            <NoticeBar color="#f44336" background="#fff">最新跟帖</NoticeBar>
            {renderList(newIds, newCommentMap)}
          </>
          : <Loading className='pageLoading' type="ball" />
      }
    </div>
  )
}

export default memo(Comment)
