import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/options'
import { FormSignout } from './signout-form'

export default async function Home() {
  await getServerSession(authOptions)
  return (
    <main>
      <FormSignout />
    </main>
  )
}
