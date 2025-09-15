    'use client'

    import { useSession } from 'next-auth/react'
    import { PayslipViewer } from '@/components/payroll/payroll-viewer'

    export default function PayslipsPage() {
    const { data: session } = useSession()

    return (
        <div>
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Payslips</h1>
            <p className="mt-2 text-sm text-gray-600">
            View and download your payslips
            </p>
        </div>

        {session?.user.employeeId && (
            <PayslipViewer employeeId={session.user.employeeId} />
        )}
        </div>
    )
    }