    'use client'

    import { useState } from 'react'
    import { LeaveForm } from '@/components/leave/leave-form'
    import { LeaveTable } from '@/components/leave/leave-table'
    import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
    import { useSession } from 'next-auth/react'

    export default function LeavePage() {
    const { data: session } = useSession()
    const [refreshKey, setRefreshKey] = useState(0)

    const handleFormSuccess = () => {
        setRefreshKey((prev) => prev + 1)
    }

    return (
        <div>
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
            <p className="mt-2 text-sm text-gray-600">
            Request leave and view your leave history
            </p>
        </div>

        <Tabs defaultValue="request" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="request">Request Leave</TabsTrigger>
            <TabsTrigger value="history">Leave History</TabsTrigger>
            </TabsList>
            <TabsContent value="request" className="space-y-4">
            <LeaveForm onSuccess={handleFormSuccess} />
            </TabsContent>
            <TabsContent value="history" className="space-y-4">
            {session?.user.employeeId && (
                <LeaveTable
                key={refreshKey}
                employeeId={session.user.employeeId}
                showActions={false}
                />
            )}
            </TabsContent>
        </Tabs>
        </div>
    )
    }