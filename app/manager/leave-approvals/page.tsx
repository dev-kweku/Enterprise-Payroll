    'use client'

    import { useState } from 'react'
    import { LeaveTable } from '@/components/leave/leave-table'
    import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

    export default function LeaveApprovalsPage() {
    const [refreshKey, setRefreshKey] = useState(0)

    const handleApprove = () => {
        setRefreshKey((prev) => prev + 1)
    }

    const handleReject = () => {
        setRefreshKey((prev) => prev + 1)
    }

    return (
        <div>
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Leave Approvals</h1>
            <p className="mt-2 text-sm text-gray-600">
            Review and approve leave requests from your team members
            </p>
        </div>

        <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="space-y-4">
            <LeaveTable
                key={`pending-${refreshKey}`}
                showActions={true}
                onApprove={handleApprove}
                onReject={handleReject}
            />
            </TabsContent>
            <TabsContent value="approved" className="space-y-4">
            <LeaveTable
                key={`approved-${refreshKey}`}
                showActions={false}
            />
            </TabsContent>
            <TabsContent value="rejected" className="space-y-4">
            <LeaveTable
                key={`rejected-${refreshKey}`}
                showActions={false}
            />
            </TabsContent>
        </Tabs>
        </div>
    )
    }