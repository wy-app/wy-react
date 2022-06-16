import { useState, useEffect } from 'react'
import { Swiper } from 'react-vant'
import './index.scss'
import { getRollingWord } from '@/api'
import { /* BrowserRouter as Router, Switch, useParams, useLocation, */ useNavigate } from 'react-router-dom'

function Header (props: any) {
  const defaultItem = <Swiper.Item key={1}><div className='hotWord'>请输入搜索关键词</div></Swiper.Item>
  const [dataList, setDataList] = useState([] as any)
  const [items, setItems] = useState([defaultItem] as any)
  const [hotWord, setHotWord] = useState('')
  const navigate = useNavigate()

  // 请求数据
  const onLoad = async () => {
    const res: any = await getRollingWord({ callback: 'callback_fyz' })
    if (!res) return
    const matchArr = res.match(/callback_fyz\((.*)\)/)
    const resultStr = JSON.parse(matchArr[1])
    const { data: { rollHotWordList } } = JSON.parse(resultStr)
    console.log(rollHotWordList)
    if (!rollHotWordList.length) return
    setDataList(rollHotWordList)
    const lists = rollHotWordList && rollHotWordList.length
      ? rollHotWordList.map((item: any, index: number) => (
        <Swiper.Item key={index} >
          <div className='hotWord'> {item.hotWord} </div>
        </Swiper.Item >
      ))
      : defaultItem
    setHotWord(rollHotWordList[0].hotWord)
    setItems(lists)
  }

  const toSearchPage = () => {
    navigate('/search', {
      state: { hotWord: hotWord }
    })
  }

  const onChange = (i: number) => {
    if (!dataList.length) return
    setHotWord(dataList[i].hotWord)
  }

  useEffect(() => {
    const timeout = setTimeout(() => onLoad(), 2000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="swiper-wrapper" {...props} onClick={toSearchPage} >
      <Swiper className='news-swiper' vertical indicator={false} autoplay={3000} duration={600} onChange={(i) => onChange(i)}>
        {items}
      </Swiper>
    </div>
  )
}

export default Header
