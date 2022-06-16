import { useState } from 'react'
import { Tabs, Flex, Field, Toast, Image, Search, Swiper } from 'react-vant'
import { /* BrowserRouter as Router, Switch, useParams, useLocation, */ useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import user from '../../assets/user.png'
import './index.scss'
import { getRollingWord } from '@/api'
import RollingWord from './rollingWord'
import { Search as SearchIcon } from '@react-vant/icons'

function Header () {
  const navigate = useNavigate()
  // const onFocus = () => {
  //   navigate('/search')
  // }

  // 请求数据
  const onLoad = async () => {
    const res: any = await getRollingWord({ callback: 'callback_fyz' })
    if (!res) return
    const data = JSON.parse(res)
    console.log(data)
  }
  return (
    <header className="App-header" >
      <Flex style={{ width: '100%', height: '100%' }} justify="center" align="center" >
        <Flex.Item span={4}>
          <Image className='logo-icon' src={logo} />
        </Flex.Item>
        < Flex.Item span={16} className="header-box">
          <div className='search-wrap'>
            <SearchIcon />
            <RollingWord />
          </div>
        </Flex.Item>
        < Flex.Item span={4} >
          <Image className='user-icon' round fit="cover" src={user} />
        </Flex.Item>
      </Flex>
    </header>
  )
}

export default Header
