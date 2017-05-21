require('dotenv').config()
import axios from 'axios'
import { router, get } from './microrouter'
import uid from 'uid-promise'

const githubUrl = process.env.GH_HOST || 'github.com'

const login = async (req, res) => {
  const state = await uid(20)
  // Should save state in a temporal DB
  return res.redirect(`https://${githubUrl}/login/oauth/authorize?client_id=${process.env.GH_CLIENT_ID}&state=${state}`)
}

const callback = async (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  const { code, state } = req.query

  if (!code && !state) {
    res.redirect('/')
    //  Should check state in temporal DB
    // } else if (!states.includes(state)) {
    //   res.redirect('/')
  }

  try {
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

    return res.json(data)
  } catch (err) {
    return res.send('Please provide GH_CLIENT_ID and GH_CLIENT_SECRET as environment variables. (or GitHub might be down)')
  }
}

export const handler = router(
  get('/login/callback', callback),
  get('/login', login)
)
