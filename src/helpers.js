import R from 'ramda'
import { MongoClient } from 'mongodb'

export const cleanUser = R.pick(['login', 'avatar_url', 'name', 'company', 'location', 'email'])
export const connectMongoDB = () => MongoClient.connect(process.env.MONGODB)

