    'use client'

    import { useSession } from 'next-auth/react'
    import { useRouter } from 'next/navigation'
    import { useEffect } from 'react'
    import { Loader2 } from 'lucide-react'
    import { Navbar } from '@/components/navbar'

    export default function AdminLayout({
    children,
    }: {
    children: React.ReactNode
    }) {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'loading') return

        if (!session || session.user.role !== 'ADMIN') {
        router.push('/login')
        }
    }, [session, status, router])

    if (status === 'loading' || !session) {
        return (
        <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
            </div>
        </main>
        </div>
    )
    }