import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import jwt from 'jsonwebtoken'
import { ACCESS_EXPIRES_IN } from '@/config'
import { JWT } from 'next-auth/jwt'

export interface BackendTokenProps {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'text', placeholder: 'your email' },
        password: {
          label: 'password',
          type: 'password',
          placeholder: 'your password',
        },
      },
      authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null

        const { email, password } = credentials

        const accessToken = jwt.sign({ id: '1' }, 'access_secret', {
          expiresIn: '30s',
        })

        const refreshToken = jwt.sign({ id: '1' }, 'refresh_secret', {
          expiresIn: '1m',
        })

        const user = {
          id: '1',
          email,
          password,
          backendTokens: {
            accessToken,
            refreshToken,
            expiresIn: new Date().getTime() + ACCESS_EXPIRES_IN,
          },
        }

        return user
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, session, trigger }) {
      console.log('Trigger: ' + trigger)

      if (user) return { ...token, ...user } as JWT

      if (token.backendTokens.expiresIn > new Date().getTime()) {
        console.log('\n\nAccess token still valid')
        return token
      }

      console.log(
        '\n\nI will get another access token with this refresh token: ',
        token.backendTokens.refreshToken.substring(token.backendTokens.refreshToken.length - 5)
      )

      const res = await fetch('http://localhost:3000/api/tokens', {
        method: 'POST',
        cache: 'no-store',
        body: JSON.stringify({
          accessToken: token.backendTokens.accessToken,
          refreshToken: token.backendTokens.refreshToken,
        }),
      })

      const backendTokens: BackendTokenProps = await res.json()

      console.log('Data i obtained: ', {
        access: backendTokens.accessToken.substring(backendTokens.accessToken.length - 5),
        refresh: backendTokens.refreshToken.substring(backendTokens.refreshToken.length - 5),
      })

      return {
        ...token,
        backendTokens: {
          refreshToken: backendTokens.refreshToken,
          accessToken: backendTokens.accessToken,
          expiresIn: backendTokens.expiresIn,
        },
      }
    },

    async session({ session, token }) {
      session = { ...session, ...token }
      console.log('\nToken from session callback:', {
        access: session.backendTokens?.accessToken.substring(token?.backendTokens.accessToken.length - 5),
        refresh: session.backendTokens?.refreshToken.substring(token?.backendTokens.refreshToken.length - 5),
      })
      return session
    },
  },
}
