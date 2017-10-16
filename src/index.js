import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import './semantic-dist/semantic.min.css'
import App from './containers'
import { Provider } from 'react-redux'
import store from './store'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'))
registerServiceWorker()
