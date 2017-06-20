require('babel-register')
const express = require('express')
const { handler } = require('./index')
const pkg = require('../package.json')

const app = express()
app.use(handler)

app.listen(process.env.PORT, () => {
  console.log(`${pkg.name} running on port ${process.env.PORT}`)
})
