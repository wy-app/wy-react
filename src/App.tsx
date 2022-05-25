import { Suspense, useState } from 'react'
import { BrowserRouter, Routes, Route, /* BrowserRouter as Router, Switch, useParams, useLocation, */ useNavigate } from 'react-router-dom'
import routes, { IRoute } from './router/index'
import './style/App.scss'
import config from './config'

function App () {
  return (
    <Suspense >
      <BrowserRouter basename={config.BASENAME}>
        <div className="app">
          <div className='app-content'>
            <Routes>
              {routes.map((route: IRoute) => (
                <Route
                  key={config.BASENAME + route.path}
                  path={route.path}
                  element={
                    <route.component />
                  }
                ></Route>
              ))}
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </Suspense>
  )
}

export default App
