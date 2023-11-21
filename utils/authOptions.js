import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from "next-auth/providers/google"
import User from '@/models/user'
import bcrypt from 'bcrypt'
import dbConnect from '@/utils/dbConnect'

export const authOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    CredentialsProvider({
      async authorize(credentials, req) {
        dbConnect()
        const { email, password } = credentials
        const user = await User.findOne({ email })
        if (!user) {
          throw new Error('Invalid email or password')
        }
        if (!user.password) {
          throw new Error(
            'Please login via the method you used to sign up',
          )
        }
        const isPasswordMatched = await bcrypt.compare(
          password,
          user.password,
        )
        if (!isPasswordMatched) {
          throw new Error('Invalid email or password')
        }
        return user
      },
    }),
  ],
  callbacks: {
    // save user if they login via social networks
    async signIn({ user }) {
      dbConnect()

      const { email } = user

      let dbUser = await User.findOne({ email })

      if (!dbUser) {
        dbUser = await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
        })
      }

      return true
    }
    // add additional user info to the session (jwt, session)
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
}
