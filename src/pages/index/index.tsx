import { Tabs } from 'react-vant'
import { useState } from 'react'
import HotList from '../hot'
import OriginalList from '../original'
import RecommendList from '../recommend'
import Header from '../../components/Header/index'
import './index.scss'
import { /* BrowserRouter as Router, Switch, useParams,  */ useLocation, useNavigate } from 'react-router-dom'

import { useCacheDispatch } from 'react-keepalive-router'

const Index = () => {
  const localtion = useLocation()
  const [activeIndex, setActiveIndex] = useState(0)
  const [tabList, setTabList] = useState([{
    id: 0,
    title: '要闻',
    value: 'aa',
    path: ''
  }, {
    id: 1,
    title: '推荐',
    value: 'recommend',
    path: ''
  }, {
    id: 2,
    title: '原创',
    value: 'original',
    path: ''
  }, {
    id: 3,
    title: '热点',
    value: 'hot',
    path: ''
  }])
  setTimeout(() => {
    if (localtion.state) {
      const { activeTab } = localtion.state as any
      const currentTabObj = tabList.find(e => e.value === activeTab)
      setActiveIndex(currentTabObj ? currentTabObj.id : 0)
    }
  })

  const renderList = (row: any) => {
    switch (row.id) {
      case 0:
        return <div></div>
      case 1:
        return <RecommendList />
      case 2:
        return <OriginalList />
      case 3:
        return <HotList></HotList>
      default:
        return <h4>暂无数据</h4>
    }
  }
  // return (
  //   <>
  //     <Header></Header>
  //     <Tabs className='tabs' sticky swipeable active={activeIndex}>
  //       {
  //         tabList.map((item, i) =>
  //           <Tabs.TabPane key={item.id} title={`${item.title}`} >
  //             {renderList(item)}
  //           </Tabs.TabPane>
  //         )
  //       }
  //     </Tabs>
  //   </>
  // )

  const cacheDispatch = useCacheDispatch()
  return <div>我是首页
    <button onClick={() => cacheDispatch({ type: 'reset' })} >清除缓存</button>
  </div>
}

export default Index
