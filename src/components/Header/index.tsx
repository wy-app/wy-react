import { useState } from 'react'
import { Tabs, Flex, Field, Toast, Image, Search } from 'react-vant'
import { /* BrowserRouter as Router, Switch, useParams, useLocation, */ useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import user from '../../assets/user.png'
import './index.scss'

function Header () {
  const navigate = useNavigate()
  const [vauge, setVauge] = useState('');
  const onFocus = () => {
    navigate('/search')
  }
  return (
    <header className="App-header" >
      <Flex style={{ width: '100%', height: '100%' }} justify="center" align="center" >
        <Flex.Item span={4}>
          <Image className='logo-icon' src={logo} />
        </Flex.Item>
        < Flex.Item span={16} >
          <Search className='search' shape="round" background="#ef4645" value={vauge} onFocus={onFocus} placeholder="请输入搜索关键词"
          />
        </Flex.Item>
        < Flex.Item span={4} >
          <Image className='user-icon' round fit="cover" src={user} />
        </Flex.Item>
      </Flex>
    </header>
  )
}

export default Header
