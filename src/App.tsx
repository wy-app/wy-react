import { useState } from 'react'
import logo from './assets/logo.png'
import user from './assets/user.png'
import './style/App.scss'
import { Tabs, Flex, Field, Toast, Image } from 'react-vant'
import { Search } from '@react-vant/icons';
import HotList from './pages/hot'

function App() {
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
  const [vauge, setVauge] = useState('');

  return (
    <div className="App">
      <header className="App-header">
        <Flex style={{ width: '100%', height: '100%' }} justify="center" align="center">
          <Flex.Item span={4}>
            {/* <img className='logo-icon' src={logo} alt="" /> */}
            <Image className='logo-icon' src={logo} />
          </Flex.Item>
          <Flex.Item span={16}>
            <Field
              style={{ borderRadius: '0.4rem', padding: '5px 15px' }}
              value={vauge}
              onChange={setVauge}
              label=""
              leftIcon={<Search />}
              placeholder="搜索"
              onClickLeftIcon={() => Toast.info('左侧图标点击')}
            />
          </Flex.Item>
          <Flex.Item span={4}>
            {/* <img className='user-icon' src={user} alt="" /> */}
            <Image className='user-icon' round fit="cover" src={user} />
          </Flex.Item>
        </Flex>
      </header>
      <div className='App-tabs'>
        <Tabs sticky swipeable>
          {tabList.map((item, i) => (
            <Tabs.TabPane key={item.id} title={`${item.title}`}>
              {item.id === 4 ? <HotList></HotList> : <h4>暂无数据</h4>}
            </Tabs.TabPane>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

export default App
