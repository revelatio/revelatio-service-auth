require('dotenv').config()
import axios from 'axios'
import { router, get } from 'microrouter'
import uid from 'uid-promise'
import jwt from 'jsonwebtoken'
import GitHubApi from 'github'
import { decode } from 'querystring'
import Promise from 'bluebird'
import R from 'ramda'

const githubUrl = process.env.GH_HOST || 'github.com'

const cleanUser = R.pick([
  "login", "id", "avatar_url", "name", "company", "location", "email"
])

const github = new GitHubApi({
  debug: false,
  protocol: "https",
  host: "api.github.com",
  headers: {
    "user-agent": "Revelat-io-App"
  },
  Promise,
  followRedirects: false,
  timeout: 5000
})

const login = async (req, res) => {
  const state = await uid(20)
  return res.redirect(`https://${githubUrl}/login/oauth/authorize?client_id=${process.env.GH_CLIENT_ID}&state=${state}`)
}

const callback = async (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  const { code, state } = req.query

  if (!code && !state) {
    return res.redirect('/')
  }

  try {
    // Use code to get an access_token from github
    const { status, data } = await axios({
      method: 'POST',
      url: `https://${githubUrl}/login/oauth/access_token`,
      responseType: 'json',
      data: {
        client_id: process.env.GH_CLIENT_ID,
        client_secret: process.env.GH_CLIENT_SECRET,
        code
      }
    })

    if (status !== 200) {
      return res.send('GitHub server error.')
    }

    // Get logged user information and craft a JWT Cookie
    const { access_token } = decode(data)
    github.authenticate({
      type: "oauth",
      token: access_token
    })
    const user = await github.users.get({})
    const resultToken = cleanUser(user.data)

    const token = jwt.sign(
      resultToken,
      process.env.JWT_SECRET,
      {
        expiresIn: '365d'
      }
    )

    // Create the JWT Cookie and redirect to /
    return res.cookie(
      'auth_token',
      token,
      {expires: new Date(Date.now() + 31536000000), httpOnly: false}
    )
      .redirect('/')

  } catch (err) {
    console.log(err)
    return res.redirect(`/?err=${err.toString()}`)
  }
}

export const handler = router(
  get('/login/callback', callback),
  get('/login', login),
  (req, res) => res.send('ok')
)
