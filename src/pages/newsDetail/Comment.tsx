import { memo, useRef, useState, useEffect } from 'react'
import { getCommentsHotList, getCommentsNewList } from '@/api'
import { /* BrowserRouter as Router, Switch, useParams,  */ useLocation, useNavigate } from 'react-router-dom'
import './detail.scss'
import { Flex, NoticeBar, Empty, List, Image, Loading, NavBar, Sticky, Skeleton, Typography } from 'react-vant'
import { GoodJobO, UserO } from '@react-vant/icons'
import { AnyMxRecord } from 'dns'

function Comment (props: any) {
  const localtion = useLocation()
  const { docid } = localtion.state as any
  if (!docid) return <Empty description="暂无数据" />
  const [hotCommentMap, setHotCommentMap] = useState({} as any)
  const [newCommentMap, setNewCommentMap] = useState({} as any)
  const [hotIds, setHotIds] = useState([])
  const [newIds, setNewIds] = useState([])
  const navigate = useNavigate()
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

  const transformTime = (time: string) => {
    const timestamp = new Date().getTime() - new Date(time).getTime()
    const minutes = timestamp / (1000 * 60)
    if (minutes < 60) {
      return Math.floor(minutes) + '分钟前'
    } else if (minutes / 60 < 24) {
      return Math.floor(minutes / 60) + '小时前'
    } else {
      return Math.floor(minutes / 60 / 24) + '天前'
    }
  }

  const renderList = (idsStringArr: any, commentMap: any) => {
    return (
      <div className='skeleton-wrap'>
        {
          idsStringArr.map((idString: string, index: number) => {
            const ids = idString.split(',').reverse()
            let commentReactDom: any = ''
            const loopReply = (obj: any, i: number, arr: string[], id: string) => {
              if (!obj) return
              if (arr.length === 1 || arr.length - 1 === i) {
                return <Flex className={arr.length === 1 ? 'skeleton-box outter' : 'skeleton-box'}>
                  {arr.length === 1
                    ? ((obj.user.avatar) ? <img alt="" src={obj.user.avatar} /> : <UserO fontSize={27} color="#aaa" />)
                    : ''
                  }
                  <div className='skeleton-content'>
                    <div className='skeleton-info'>
                      <Typography.Title className='skeleton-title' level={5}>
                        {arr.length !== 1 && <i className='NO'>1</i>}
                        {obj.user.nickname || '火星网友'}
                        {obj.user.titleInfo
                          ? <Typography.Text type="secondary" className='titleInfo'>
                            <img className="titleIcon" src={obj.user.titleInfo.titleIcon} />
                            {obj.user.titleInfo.title}
                          </Typography.Text>
                          : ''
                        }
                        <div className='vote-wrap'>{obj.vote}<GoodJobO className='vote-icon' /></div>
                      </Typography.Title>
                      <div>
                        <Typography.Text type='secondary' className='location'>{obj.user.location}</Typography.Text>
                        {i !== 0 && <Typography.Text type="secondary" className='createTime'>{transformTime(obj.createTime)}</Typography.Text>}
                      </div>
                      <div className='content'>
                        <Typography.Text >
                          <div dangerouslySetInnerHTML={{ __html: obj.content }}></div>
                        </Typography.Text>
                      </div>
                      {i === 0 && <div><Typography.Text type="secondary" className='createTime'>{transformTime(obj.createTime)}</Typography.Text></div>}
                    </div>
                  </div>
                </Flex >
              } else {
                const id = ids[i + 1]
                return <Flex className={i === 0 ? 'skeleton-box outter' : 'skeleton-box'}>
                  {i === 0
                    ? (obj.user) ? <img alt="" src={obj.user.avatar} /> : <UserO />
                    : ''}
                  <div className='skeleton-content'>
                    {i !== 0 && <div>{loopReply(commentMap[id], i + 1, ids, id)}</div>}
                    <div className='skeleton-info'>
                      <Typography.Title className='skeleton-title' level={5}>
                        {i !== 0 && <i className='NO'>{ids.length - i}</i>
                        }{obj.user.nickname || '火星网友'}
                        <Typography.Text type="secondary" className='titleInfo'>{obj.user.titleInfo && obj.user.titleInfo.title}</Typography.Text>
                        <div className='vote-wrap'>{obj.vote}<GoodJobO className='vote-icon' /></div>
                      </Typography.Title>
                      <div>
                        <Typography.Text className='location' type="secondary">{obj.user.location}</Typography.Text>
                        {i !== 0 && <Typography.Text type="secondary" className='createTime'>{transformTime(obj.createTime)}</Typography.Text>}
                      </div>
                      {i === 0 && <div>{loopReply(commentMap[id], i + 1, ids, id)}</div>}
                      <div className='content'>
                        <Typography.Text >
                          <div dangerouslySetInnerHTML={{ __html: obj.content }}></div>
                        </Typography.Text>
                      </div>
                      {i === 0 && <div><Typography.Text type="secondary" className='createTime'>{transformTime(obj.createTime)}</Typography.Text></div>}
                    </div>
                  </div>
                </Flex>
              }
            }
            commentReactDom = loopReply(commentMap[ids[0]], 0, ids, ids[0])
            // }
            // console.log(commentReactDom)
            return (
              <Skeleton avatar key={index} loading={false} rowHeight={10}>
                {commentReactDom}
              </Skeleton>
            )
          })
        }
      </div >
    )
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
                {renderList(hotIds, hotCommentMap)}
              </>
              : ''
          }
          {
            newIds.length
              ? <>
                <NoticeBar color="#f44336" background="#fff">最新跟帖</NoticeBar>
                {renderList(newIds, newCommentMap)}
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
