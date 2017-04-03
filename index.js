/**
 * index.js - sous-chef
 * 
 * Licensed under Apache 2.0.
 */

import fs                     from 'fs'
import path                   from 'path'
import {
  User,
  Item,
  Meal,
  Order
}                             from './lib'
import morgan                 from 'morgan'
import express                from 'express'
import imagemin               from 'imagemin'
import multiparty             from 'multiparty'
import bodyParser             from 'body-parser'
import assign                 from 'deep-assign'
import session                from 'cookie-session'
import imageminPngquant       from 'imagemin-pngquant'

const app = express()
    , http = require('http').createServer(app)
    , pub = express.static(__dirname + '/public')
    , _data = {
        info: {},
        base: require('./public/data/base.json'),
        user: require('./public/data/user.json'),
        admin: require('./public/data/admin.json'),
        chef: require('./public/data/chef.json')
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
    , auth = (type, go) => (req, res, next) => {
        if (typeof type === 'string') {
          type = [type]
        }

        if (req.session.isPopulated && type.indexOf(req.session.user.type) !== -1) {
          if (typeof go === 'function') {
            go(req, res)
              .then(json => res.json(json))
              .catch(err => res.status(500).end(String(err)))
          } else next()
        } else {
          res.status(403).end('You do not have permissions to do this action.')
        }
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
  extended: true
}))
app.use(bodyParser.json())

/**
 * Handle forms and actions.
 */
app.post('/item/edit/:item', auth('user', async (req, res) => {
  await Item.updateItem(req.session.user.uid, req.params.item, req.body)
  return {}
}))

app.post('/item/edit/:item/photo', auth('user'), (req, res) => {
  const form = new multiparty.Form()

  form.parse(req, (err, _, files) => {
    if (err) res.status(500).end(String(err))
    else fs.readFile(files.photo[0].path, (rerr, rawBuffer) => {
      if (rerr) res.status(500).end(String(rerr))
      else imagemin.buffer(rawBuffer, {
           plugins: [
             imageminPngquant({ quality: '50-60' })
           ]
         })
           .then(buffer => Item.updatePhoto(req.session.user.uid, req.params.item, buffer.toString('base64')))
           .then(() => res.json({}))
           .catch(err => res.status(500).end(String(err)))
    })
  })
})

app.get('/item/photo/:item', auth('user'), async (req, res) => {
  let tag = req.headers['if-none-match'] || req.headers['if-match']

  if (tag && tag === await Item.getPhotoTag(req.session.user.uid, req.params.item)) {
    return res.status(304).end()
  }

  try {
    const r = await Item.getPhoto(req.session.user.uid, req.params.item)

    if (r.length === 1 && r[0] && r[0].photo) {
      let p = Buffer.from(r[0].photo, 'base64')

      res.set('ETag', r[0].etag)
      res.end(p)
    } else res.redirect('http://placehold.it/350x150')
  } catch (err) {
    console.log(err.stack || err.message || String(err))
    res.redirect('http://placehold.it/350x150')
  }
})

app.get('/item/pages.json', auth('user'), (req, res) => {
  Item.pages(req.session.user.uid)
    .then(pages => res.json({ status: 'OK', pages }))
    .catch(err => res.status(500).end(String(err)))
})

app.get('/item/all.json', auth('user'), (req, res) => {
  let page = parseInt(req.query.page, 10)
  if (isNaN(page)) page = 0

  Item.all(req.session.user.uid, page)
    .then(items => res.json({ status: 'OK', results: items }))
    .catch(err => res.status(500).end(String(err)))
})

app.post('/meal/edit/:meal', auth('user'), async (req, res) => {
  try {
    await Meal.updateMeal(req.params.meal, req.body)
    res.json({})
  } catch (err) {
    res.status(500).end(String(err))
  }
})

app.post('/meal/edit/:meal/photo', auth('user'), (req, res) => {
  const form = new multiparty.Form()

  form.parse(req, (err, _, files) => {
    if (err) res.status(500).end(String(err))
    else fs.readFile(files.photo[0].path, (rerr, rawBuffer) => {
      if (rerr) res.status(500).end(String(rerr))
      else imagemin.buffer(rawBuffer, {
           plugins: [
             imageminPngquant({ quality: '50-60' })
           ]
         })
           .then(buffer => Meal.updatePhoto(req.params.meal, buffer.toString('base64')))
           .then(() => res.json({}))
           .catch(err => res.status(500).end(String(err)))
    })
  })
})

app.get('/meal/photo/:meal', async (req, res) => {
  let tag = req.headers['if-none-match'] || req.headers['if-match']

  if (tag && tag === await Meal.getPhotoTag(req.params.meal)) {
    return res.status(304).end()
  }

  try {
    const r = await Meal.getPhoto(req.params.meal)

    if (r.length === 1 && r[0] && r[0].photo) {
      let p = Buffer.from(r[0].photo, 'base64')

      res.set('ETag', r[0].etag)
      res.end(p)
    } else res.redirect('http://placehold.it/350x150')
  } catch (err) {
    console.log(err.stack || err.message || String(err))
    res.redirect('http://placehold.it/350x150')
  }
})

app.get('/meal/pages.json', auth('user'), (req, res) => {
  Meal.pages()
    .then(pages => res.json({ status: 'OK', pages }))
    .catch(err => res.status(500).end(String(err)))
})

app.get('/meal/all.json', auth('user'), (req, res) => {
  let page = parseInt(req.query.page, 10)
  if (isNaN(page)) page = 0

  Meal.all(page)
    .then(meals => res.json({ status: 'OK', results: meals }))
    .catch(err => res.status(500).end(String(err)))
})

app.get('/meal/steps/:meal', auth(['user', 'chef'], async (req, res) => {
  return await Meal.getSteps(req.params.meal)
}))

app.get('/meal/ingredients/:meal', auth(['user', 'chef'], async (req, res) => {
  return await Meal.getIngredients(req.params.meal)
}))

app.get('/meal/order/:meal/:servings', auth('user'), async (req, res) => {
  try {
    res.json(await Meal.placeOrder(req.session.user.uid, req.params.meal, parseInt(req.params.servings, 10)))
  } catch (err) {
    res.status(500).end(String(err))
  }
})

app.get('/order/pages.json', auth(['admin', 'chef']), (req, res) => {
  Order['pages' + req.session.user.type]()
    .then(pages => res.json({ status: 'OK', pages }))
    .catch(err => res.status(500).end(String(err)))
})

app.get('/order/all.json', auth(['admin', 'chef']), (req, res) => {
  let page = parseInt(req.query.page, 10)
  if (isNaN(page)) page = 0

  Order['all' + req.session.user.type](page)
    .then(results => res.json({ status: 'OK', results }))
    .catch(err => res.status(500).end(String(err)))
})

app.get('/order/reject/:meal/by/:owner', auth(['admin', 'chef'], async (req, res) => {
  return await Order.reject(
    await User.name2id(req.params.owner),
    req.params.meal
  )
}))

app.get('/order/approve/:meal/by/:owner', auth('admin', async (req, res) => {
  return await Order.approve(
    await User.name2id(req.params.owner), 
    req.params.meal
  )
}))

app.get('/order/complete/:meal/by/:owner', auth('chef', async (req, res) => {
  await Order.complete(
    await User.name2id(req.params.owner), 
    req.params.meal
  )

  return {}
}))

app.get('/item/all-ever', auth('chef', async (req, res) => {
  return (await Item.getAll()).map(item => item.name)
}))

app.post('/meal/create', auth('chef', async (req, res) => {
  let meal = req.body.name

  await Meal.create(meal, req.body.description, req.body.category)

  for (let item of req.body.ingredients) await Meal.createRequirement(meal, item.text, parseFloat(item.quantity))
  for (let step of req.body.steps) await Meal.createStep(meal, step.step, parseFloat(step.duration))

  return {}
}))

app.get('/logout', (req, res) => {
  req.session = null
  res.redirect('/')
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
 * Various home page redirects.
 */
const HOME_ROUTES = [
  '/',
  '/browse',
  '/meals',
  '/index.html'
]

app.get(/.*/, (req, res, next) => {
  if (HOME_ROUTES.indexOf(req.url) !== -1) {
    res.render('index', data(!req.session.isPopulated ? 'info' : req.session.user.type, req.session))
  } else next()
})

/**
 * Staticish.
 */
app.use(pub)

// start up server
http.listen(process.env.PORT || 8080, () =>
  console.log('Listening at :%s', http.address().port)
)