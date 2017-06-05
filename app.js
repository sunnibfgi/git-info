
const http = require('http')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const index = require('./routes/index')
const app = express()
let port = process.env.NODE_ENV || 7000


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', index)


app.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function(err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
  res.render('error')
})

module.exports = app


http.createServer(app).listen(port, function(){
	console.log('server running on port '+port)
})


