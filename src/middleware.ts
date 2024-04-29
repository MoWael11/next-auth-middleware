import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      console.log('\n\n\n======================= NEW REQUEST FROM CLIENT =======================')
      console.log('Token from middleware: ', {
        access: token?.backendTokens.accessToken.substring(token?.backendTokens.accessToken.length - 5),
        refresh: token?.backendTokens.refreshToken.substring(token?.backendTokens.refreshToken.length - 5),
      }) // the old one will be passed
      return !!token
    },
  },
})

export const config = {
  matcher: ['/'],
}
