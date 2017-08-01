import R from 'ramda'
import { MongoClient } from 'mongodb'
import uuidv4 from 'uuid/v4'
import keygen from 'ssh-keygen'
import Promise from 'bluebird'
import del from 'del'

export const cleanUser = R.pick(['login', 'avatar_url', 'name', 'company', 'location', 'email'])
export const connectMongoDB = () => MongoClient.connect(process.env.MONGODB)

export const generateKeypair = () => new Promise((resolve, reject) => {
  const location = `${__dirname}/sshworkspace/${uuidv4()}_rsa`
  console.log(location)

  keygen({
    location,
    comment: 'Revelat.io',
    password: '',
    read: true
  }, (err, out) => {
    if(err) {
      return reject(err)
    }

    console.log(out)
    return resolve({
      location,
      privateKey: out.key,
      publicKey: out.pubKey
    })
  })
})
  .then(({location, privateKey, publicKey}) => del(`${location}*`)
    .then(() => ({privateKey, publicKey})))
