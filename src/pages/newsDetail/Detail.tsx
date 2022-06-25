import { memo, useRef, useState, useEffect } from 'react'
import { getDetailData } from '@/api'
import { /* BrowserRouter as Router, Switch, useParams,  */ useLocation, useNavigate } from 'react-router-dom'
import './detail.scss'
import { Cell, List, Empty, Search, Image, Loading, NavBar, Sticky, ShareSheet, Button } from 'react-vant'
import { ShareO } from '@react-vant/icons'
interface DetailDataType {
  title: string
  docid: string
  body: string
  statement?: string
  ipLocation: string
  ptime: string
  source: string
  replyCount: number
}
const shareOptions = [
  { name: '微信', icon: 'wechat' },
  { name: '微博', icon: 'weibo' },
  { name: '复制链接', icon: 'link' },
  { name: '分享海报', icon: 'poster' },
  { name: '二维码', icon: 'qrcode' },
]
function Detail (props: any) {
  const localtion = useLocation()
  const { id, activeTab, from } = localtion.state as any
  if (!id) return <Empty description="暂无数据" />
  const [detailData, setDetailData] = useState({} as DetailDataType)
  const navigate = useNavigate()
  const [showShare, setShowShare] = useState(false)

  // 请求数据
  const onLoad = async () => {
    const res: any = await getDetailData({ callback: 'callback_fyz' }, { docid: id })
    if (!res) return
    const matchArr = res.match(/callback_fyz\((.*)\)/)
    const resultStr = JSON.parse(matchArr[1])
    const data = JSON.parse(resultStr)
    console.log(data)
    const detail = data[id]
    detail.img && detail.img.forEach((e: any) => {
      const sizes = e.pixel.split('*')
      detail.body = detail.body.replace(e.ref, `<img src="${e.src}" width="100%" />`)
    })
    detail.video && detail.video.forEach((e: any) => {
      detail.body = detail.body.replace(e.ref, `</p><video width="100%" controls>
      <source src="${e.url_mp4}" type="video/mp4">
    </video>`)
    })
    console.log(detail)
    setDetailData(detail)
  }

  useEffect(() => {
    if (id) {
      const timeout = setTimeout(() => onLoad());
      return () => clearTimeout(timeout)
    }
  }, [id])

  const goBack = () => {
    if (from === 'search') {
      navigate('/search', {
        state: { activeTab: activeTab }
      })
    } else {
      navigate('/', {
        state: { activeTab: activeTab }
      })
    }
  }

  const navRightClick = (e: any) => {
    if (!e || !e.target) return
    const className = e.target.className
    if (className.includes('shareIcon')) {
      setShowShare(true)
    } else if (className.includes('replyBtn')) {
      navigate('/comment', {
        state: { docid: id }
      })
    }
  }

  return (
    <article >
      {
        detailData.title
          ? <>
            <Sticky {...props}>
              <NavBar title="" leftText="返回" rightText={<><Button className='replyBtn' {...props} round type="danger" plain size="mini">{`${detailData.replyCount}人参与跟帖`}</Button><ShareO className='shareIcon' fontSize={21} /></>}
                onClickLeft={() => goBack()} onClickRight={() => navRightClick(event)}
              />
            </Sticky>
            <ShareSheet visible={showShare} options={shareOptions} title="立即分享给好友"
              onCancel={() => setShowShare(false)}
              onSelect={(option, index) => {
                console.log(option, index)
                setShowShare(false)
              }}
            />
            <div className='detail-content'>
              <div className='title'>{detailData.title}</div>
              <div className='head-info'>
                <span>{detailData.ptime}</span>
                <span>{detailData.ipLocation}</span>
                <div>{detailData.source}</div>
              </div>
              <div dangerouslySetInnerHTML={{ __html: detailData.body }}></div>
              <p>{detailData.statement}</p>
            </div>
          </>
          : <Loading className='pageLoading' type="ball" />
      }
    </article>

  )
}

export default memo(Detail)
