import { Flex, Typography, Skeleton } from 'react-vant'
import { GoodJobO, UserO } from '@react-vant/icons'
import { transformTime } from '@/utils/tools'

interface listProp {
  ids: [string]
  commentMap: Object | any
}
// 评论渲染组件
function RenderList (props: listProp) {
  const { ids, commentMap } = props

  return (
    <div className='skeleton-wrap'>
      {
        ids.map((idString: string, index: number) => {
          const ids = idString.split(',').reverse()
          let commentReactDom: any = ''
          const loopReply = (obj: any, i: number, arr: string[], id: string) => {
            if (!obj) return
            if (obj.imageInfo && obj.imageInfo.url) {
              obj.content = obj.content.replace('[图片]', `<Image width="150" height="150" fit="cover" src=${obj.imageInfo.url} title="图片" />`)
            }
            if (arr.length === 1 || arr.length - 1 === i) {
              return <Flex className={arr.length === 1 ? 'skeleton-box outter' : 'skeleton-box'}>
                {arr.length === 1
                  ? ((obj.user.avatar) ? <img className='avatar' alt="" src={obj.user.avatar} /> : <UserO fontSize={27} color="#aaa" />)
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
                  ? (obj.user) ? <img className='avatar' alt="" src={obj.user.avatar} /> : <UserO />
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
export default RenderList
