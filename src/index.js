import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import createHistory from 'history/createBrowserHistory'

import { ConnectedRouter, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import AppReducer from './App.reducer'
import AppRouter from './App.routes'

const history = createHistory()
const router = routerMiddleware(history)

const middleware = [router, thunk]
let store = createStore(AppReducer, applyMiddleware(...middleware))

ReactDOM.render(
<Provider store={store}>
  <div>
    <ConnectedRouter history={history}>
      <div>
        <AppRouter />
      </div>
    </ConnectedRouter>
  </div>
</Provider>,
document.getElementById('root'));

registerServiceWorker();
