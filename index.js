/**
 * index.js - sous-chef
 * 
 * Licensed under Apache 2.0.
 */

import path       from 'path'
import morgan     from 'morgan'
import express    from 'express'
import User       from './lib/user'
import bodyParser from 'body-parser'
import assign     from 'deep-assign'
import session    from 'cookie-session'

const app = express()
    , http = require('http').createServer(app)
    , pub = express.static(__dirname + '/public')
    , _data = {
        base: require('./public/data/base.json'),
        user: require('./public/data/user.json')
      }
    , unique = (elm, index, self) => {
        return self.lastIndexOf(elm) === index
      }
    , data = (type, sess) => {
        let dat = assign(
          { sess: { user: { type: 'info' } } },
          { sess },
          JSON.parse(JSON.stringify(_data.base)),
          _data[type]
        )

        // fix assign of arrays
        dat.styles = _data.base.styles.concat(_data[type].styles)
        dat.scripts = _data.base.scripts.concat(_data[type].scripts)

        return dat
      }

/**
 * Rendering engine.
 */
app.set('views', path.resolve(__dirname, 'public', 'routes'))
app.set('view engine', 'ejs')

/**
 * Setup middleware.
 */
app.use(morgan('dev'))
app.use(session({
  name: 'sid',
  keys: require('./keys')
}))
app.use(bodyParser.urlencoded({
  extended: false
}))

/**
 * Handle forms and actions.
 */
app.get('/logout', (req, res) => {
  req.session = null
  res.redirect('/').end()
})

app.post('/', (req, res, next) => {
  let { email, pass } = req.body || {}

  User.login(email, pass)
    .then(users => {
      const user = (users || [])[0]

      if (user) {
        req.session.user = user
        res.redirect('/')
      } else {
        res.status(403).render('index', Object.assign(data('info'), { error: 'Incorrect email or password.' }))
      }
    })
    .catch(err =>
      res.status(500).end(String(err.stack || err))
    )
})

/**
 * Staticish.
 */
app.get(/.*/, (req, res, next) => {
  if (req.url === '/' || req.url === '/index.html') {
    res.render('index', data(!req.session.isPopulated ? 'info' : req.session.user.type, req.session))
  } else pub(req, res, next)
})

// start up server
http.listen(process.env.PORT || 8080, () =>
  console.log('Listening at :%s', http.address().port)
)