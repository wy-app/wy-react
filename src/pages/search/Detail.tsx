import { memo, useRef, useState, useEffect } from 'react'
import { getDetailData } from '@/api'
import { /* BrowserRouter as Router, Switch, useParams,  */ useLocation, useNavigate } from 'react-router-dom'
import './index.scss'
import { Cell, List, Empty, Search, Image, Loading, Sticky } from 'react-vant'

interface DetailProps {
  id: string
}
interface DetailDataType {
  title: string
  docid: string
  body: string
}
function Detail (props: any) {
  const { state }: any = useLocation()
  if (!state.id) return <Empty description="暂无数据" />
  const [detailData, setDetailData] = useState({} as DetailDataType)

  // 请求数据
  const onLoad = async () => {
    const res: any = await getDetailData({ callback: 'callback_fyz' }, { docid: state.id })
    if (!res) return
    const matchArr = res.match(/callback_fyz\((.*)\)/)
    const resultStr = JSON.parse(matchArr[1])
    const data = JSON.parse(resultStr)
    console.log(data)
    const detail = data[state.id]
    detail.img.forEach((e: any) => {
      const sizes = e.pixel.split('*')
      detail.body = detail.body.replace(e.ref, `<img src="${e.src}" width="100%" />`)
    })
    console.log(detail)
    setDetailData(detail)
  }

  useEffect(() => {
    onLoad()
  }, [])

  return (
    <article >
      <div className='detail-content'>
        <h3>{detailData.title}</h3>
        <div dangerouslySetInnerHTML={{ __html: detailData.body }}></div>
      </div>
    </article>
  )
}

export default memo(Detail)
