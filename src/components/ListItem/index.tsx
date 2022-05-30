import { useState } from 'react'
import { Cell, Flex, Field, Toast, Image, Search } from 'react-vant'
import { /* BrowserRouter as Router, Switch, useParams, useLocation, */ useNavigate } from 'react-router-dom'
import './index.scss'
import { newsItem } from '../../types/news'

interface listItemProp {
  key: number
  data: Object
}
function ListItem (props: listItemProp) {
  const row = props.data as newsItem
  return <>{
    (row.skipType === 'doc' || row.skipType === 'video')
      ? (
        <div className="data-row flex">
          <div className='content'>
            <div className='new-title'>{row.title}</div>
            <div className='detail'>
              <div className='news-tag'>{row.tag || ''}</div>
              <div className='news-source'>{row.source || ''}</div>
              <div className='ptime'>{row.ptime ? row.ptime.slice(0, -3) : ''}</div>
              {/* <div className='reply'>{row.tcount}跟贴</div> */}
            </div>
          </div>
          {row.imgsrc ? <div className='img-wrap'><Image fit="cover" height="85" src={row.imgsrc} /></div> : null}
        </div >
      )
      : <>{
        row.picInfo.length >= 3
          ? (
            <div className="data-row" >
              <div className='new-title'>{row.title}</div>
              <div className='img-wrap'>
                {row.picInfo.map((e: any) => <Image fit="cover" height="100" src={e.url} />)}
              </div>
              <div className='detail'>
                <div className='news-tag'>{row.tag || ''}</div>
                <div className='news-source'>{row.source || ''}</div>
                <div className='ptime'>{row.ptime ? row.ptime.slice(0, -3) : ''}</div>
                <div className='reply'>{row.tcount}跟贴</div>
              </div>
            </div >
          )
          : (
            <div className="data-row">
              <div className='new-title'>{row.title}</div>
              {row.picInfo ? <div className='img-wrap'><Image fit="cover" height="200" src={row.picInfo[0].url} /></div> : null}
              <div className='detail'>
                <div className='news-tag'>{row.tag || ''}</div>
                <div className='news-source'>{row.source || ''}</div>
                <div className='ptime'>{row.ptime ? row.ptime.slice(0, -3) : ''}</div>
                <div className='reply'>{row.tcount}跟贴</div>
              </div>
            </div >
          )
      }</>
  }</>
}

export default ListItem
