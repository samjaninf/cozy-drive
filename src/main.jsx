import 'babel-polyfill'

import './styles/main'

import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Redirect, hashHistory } from 'react-router'
import { I18n } from './plugins/preact-polyglot'

import App from './components/App'
import Table from './components/Table'

const context = window.context
const lang = document.documentElement.getAttribute('lang') || 'en'

document.addEventListener('DOMContentLoaded', () => {
  render((
    <I18n context={context} lang={lang}>
      <Router history={hashHistory}>
        <Route component={(props) =>
          <App {...props} />}
        >
          <Redirect from='/' to='files' />
          <Route
            path='files'
            component={(props) =>
              <Table {...props} />
            }
          />
          <Route
            path='recent'
            component={(props) =>
              <p style='margin-left: 2em'>Coming soon!</p>
            }
          />
          <Route
            path='shared'
            component={(props) =>
              <p style='margin-left: 2em'>Coming soon!</p>
            }
          />
          <Route
            path='activity'
            component={(props) =>
              <p style='margin-left: 2em'>Coming soon!</p>
            }
          />
          <Route
            path='trash'
            component={(props) =>
              <p style='margin-left: 2em'>Coming soon!</p>
            }
          />
        </Route>
      </Router>
    </I18n>
  ), document.querySelector('[role=application]'))
})
