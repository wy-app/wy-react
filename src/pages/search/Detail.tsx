import { memo, useRef, useState, useEffect } from 'react'
import { getDetailData } from '@/api'
import { /* BrowserRouter as Router, Switch, useParams,  */ useLocation, useNavigate } from 'react-router-dom'
import './index.scss'
import { Cell, List, Empty, Search, Image, Loading, NavBar, Sticky } from 'react-vant'
interface DetailDataType {
  title: string
  docid: string
  body: string
  statement?: string
  ipLocation: string
  ptime: string
  source: string
}
function Detail (props: any) {
  const localtion = useLocation()
  const { id, activeTab, from } = localtion.state as any
  if (!id) return <Empty description="暂无数据" />
  const [detailData, setDetailData] = useState({} as DetailDataType)
  const navigate = useNavigate()

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
      detail.body = detail.body.replace(e.ref, `</p><video width="100%" controls autoplay>
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

  return (
    <article >
      <Sticky {...props}>
        <NavBar title="" leftText="返回" rightText=""
          onClickLeft={() => goBack()} // onClickRight={() => Toast('按钮')}
        />
      </Sticky>
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
    </article>
  )
}

export default memo(Detail)
