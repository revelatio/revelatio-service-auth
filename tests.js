const GitHubApi = require('github')
const Promise = require('bluebird')
const R = require('ramda')
// const nodegit = require('nodegit')
const path = require('path')
const sha1 = require('sha1')
const rimraf = require('rimraf')
const uuidv4 = require('uuid/v4')
const keygen = require('ssh-keygen')
const del = require('del')

const github = new GitHubApi({
  debug: false,
  protocol: 'https',
  host: 'api.github.com',
  headers: {
    'user-agent': 'Revelat-io-App'
  },
  Promise,
  followRedirects: false,
  timeout: 5000
})

github.authenticate({
  type: 'oauth',
  token: '44922fea00f63be7e455300e01ddb56eb0f91459'
})

github.users.get({}).then(console.log)

// github.repos.getAll({per_page: 100, page: 2})
//   .then(R.prop('data'))
//   .then(d => console.log(d.length))

// .then(repos => {
//   console.log(repos.length)
//   console.log(R.pluck('full_name')(repos))
// })


// github.repos.create({
//   name: 'arbolio-app',
//   private: true,
//   description: 'Arbol.io app',
//   auto_init: true
// })
// .then(response => console.log(response))






// const removeFolder = path => new Promise((resolve, reject) => {
//   rimraf(path, err => {
//     if (err) {
//       reject(err)
//     } else {
//       resolve()
//     }
//   })
// })
//
// const forkRepo = (owner, repo) => github.repos.fork({ owner, repo })
//   .then(R.prop('data'))

//
// github.repos.addCollaborator({
//   owner: 'ernestofreyreg',
//   repo: 'truput-app',
//   username: 'yenesisyc',
//   permission: 'push'
// })
// .then(console.log)


// Update keys
// const keys = await getKeysForUser(github)
// if (!keys.some(key => key.title === 'Revelat.io')) {
//   const sshKeys = await generateKeypair()
//   console.log(sshKeys)
//
//   const keyData = {
//     title: 'Revelat.io',
//     key: sshKeys.publicKey
//   }
//   userAccountUpdate.publicKey = sshKeys.publicKey
//   userAccountUpdate.privateKey = sshKeys.privateKey
//   await github.users.createKey(keyData)
// }