'use client'

import { signOut } from 'next-auth/react'

export const FormSignout = () => (
  <form>
    <button onClick={() => signOut()}>Sign out</button>
  </form>
)
