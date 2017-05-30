require('babel-register')
const express = require('express')
const { handler } = require('./index')
const pkg = require('../package.json')

const app = express()
app.use(handler)

app.listen(pkg.local.port, () => {
  console.log(`${pkg.name} running on port ${pkg.local.port}`)
})
