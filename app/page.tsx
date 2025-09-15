'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (session) {
      // Redirect based on user role
      switch (session.user.role) {
        case 'ADMIN':
          router.push('/admin/dashboard')
          break
        case 'HR':
          router.push('/hr/dashboard')
          break
        case 'MANAGER':
          router.push('/manager/dashboard')
          break
        case 'EMPLOYEE':
          router.push('/employee/dashboard')
          break
        default:
          router.push('/login')
      }
    } else {
      router.push('/login')
    }
  }, [session, status, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )
}
