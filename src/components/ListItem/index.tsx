import { useState } from 'react'
import { Cell, Flex, Field, Toast, Image, Search } from 'react-vant'
import { /* BrowserRouter as Router, Switch, useParams, useLocation, */ useNavigate } from 'react-router-dom'
import './index.scss'
import { newsItem } from '../../types/news'

interface listItemProp {
  key?: number | string
  data: Object
  activeTab?: string
}
function ListItem (props: listItemProp) {
  const navigate = useNavigate()

  const toDetail = (row: any) => {
    console.log(row)
    let docid = row.docid
    if (!row.docid) {
      const arr = row.link.split('/')
      const str = arr[arr.length - 1]
      docid = str.split('.')[1]
    }
    navigate('/detail', {
      state: { id: docid, activeTab: props.activeTab }
    })
  }
  const row = props.data as newsItem
  return <div onClick={() => toDetail(row)}>
    {
      (row.skipType === 'doc' || row.skipType === 'video' || row.postid)
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
            {row.imgsrc ? <div className='img-wrap'><Image className='img' fit="cover" src={row.imgsrc} /></div> : null}
          </div >
        )
        : <>{
          row.picInfo && row.picInfo.length >= 3
            ? (
              <div className="data-row" >
                <div className='new-title'>{row.title}</div>
                <div className='img-wrap'>
                  {row.picInfo.map((e: any, i) => <Image fit="cover" height="100" src={e.url} key={i} />)}
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
                {/* {row.imgsrc ? <div className='img-wrap'><Image fit="cover" height="200" src={row.imgsrc} /></div> : null} */}
                <div className='detail'>
                  <div className='news-tag'>{row.tag || ''}</div>
                  <div className='news-source'>{row.source || ''}</div>
                  <div className='ptime'>{row.ptime ? row.ptime.slice(0, -3) : ''}</div>
                  <div className='reply'>{row.tcount || row.replyCount}跟贴</div>
                </div>
              </div >
            )
        }</>
    }
  </div>
}

export default ListItem
