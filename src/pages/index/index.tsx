import { Tabs } from 'react-vant'
import { useState } from 'react'
import HotList from '../hot'
import OriginalList from '../original'
import Header from '../../components/Header/index'
import './index.scss'

const Index = () => {
  const [tabList, setTabList] = useState([{
    id: 1,
    title: '要闻',
    path: ''
  }, {
    id: 2,
    title: '推荐',
    path: ''
  }, {
    id: 3,
    title: '原创',
    path: ''
  }, {
    id: 4,
    title: '热点',
    path: ''
  }])
  const renderList = (row: any) => {
    switch (row.id) {
      case 1:
        return <div></div>
      case 2:
        return <div></div>
      case 3:
        return <OriginalList />
      case 4:
        return <HotList></HotList>
      default:
        return <h4>暂无数据</h4>
    }
  }
  return (
    <>
      <Header></Header>
      <Tabs className='tabs' sticky swipeable >
        {
          tabList.map((item, i) =>
            <Tabs.TabPane key={item.id} title={`${item.title}`} >
              {renderList(item)}
            </Tabs.TabPane>
          )
        }
      </Tabs>
    </>
  )
}

export default Index
