    'use client'

    import { useState, useEffect } from 'react'
    import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    } from '@/components/ui/table'
    import { Button } from '@/components/ui/button'
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
    import { Badge } from '@/components/ui/badge'
    import { MoreHorizontal, Check, X } from 'lucide-react'
    import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    } from '@/components/ui/dropdown-menu'
    import { Leave, LeaveStatus, LeaveType } from '@prisma/client'

    interface LeaveTableProps {
    employeeId?: string
    showActions?: boolean
    onApprove?: (leaveId: string) => void
    onReject?: (leaveId: string) => void
    }

    export function LeaveTable({
    employeeId,
    showActions = false,
    onApprove,
    onReject,
    }: LeaveTableProps) {
    const [leaves, setLeaves] = useState<Leave[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchLeaves()
    }, [employeeId])

    const fetchLeaves = async () => {
        setIsLoading(true)
        try {
        const url = employeeId ? `/api/leave?employeeId=${employeeId}` : '/api/leave'
        const response = await fetch(url)
        if (response.ok) {
            const data = await response.json()
            setLeaves(data)
        } else {
            console.error('Failed to fetch leaves')
        }
        } catch (error) {
        console.error('Error fetching leaves:', error)
        } finally {
        setIsLoading(false)
        }
    }

    const handleApprove = async (leaveId: string) => {
        try {
        const response = await fetch(`/api/leave/${leaveId}/approve`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'APPROVED' }),
        })

        if (response.ok) {
            fetchLeaves()
            if (onApprove) onApprove(leaveId)
        }
        } catch (error) {
        console.error('Error approving leave:', error)
        }
    }

    const handleReject = async (leaveId: string) => {
        try {
        const response = await fetch(`/api/leave/${leaveId}/approve`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'REJECTED' }),
        })

        if (response.ok) {
            fetchLeaves()
            if (onReject) onReject(leaveId)
        }
        } catch (error) {
        console.error('Error rejecting leave:', error)
        }
    }

    const getStatusBadgeColor = (status: LeaveStatus) => {
        switch (status) {
        case LeaveStatus.PENDING:
            return 'bg-yellow-100 text-yellow-800'
        case LeaveStatus.APPROVED:
            return 'bg-green-100 text-green-800'
        case LeaveStatus.REJECTED:
            return 'bg-red-100 text-red-800'
        case LeaveStatus.CANCELLED:
            return 'bg-gray-100 text-gray-800'
        default:
            return 'bg-gray-100 text-gray-800'
        }
    }

    const getLeaveTypeLabel = (type: LeaveType) => {
        switch (type) {
        case LeaveType.ANNUAL:
            return 'Annual Leave'
        case LeaveType.SICK:
            return 'Sick Leave'
        case LeaveType.UNPAID:
            return 'Unpaid Leave'
        case LeaveType.MATERNITY:
            return 'Maternity Leave'
        case LeaveType.PATERNITY:
            return 'Paternity Leave'
        default:
            return type
        }
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString()
    }

    return (
        <Card>
        <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
            <CardDescription>
            {employeeId ? 'Your leave requests' : 'Manage employee leave requests'}
            </CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
            <div className="flex justify-center py-8">Loading leave requests...</div>
            ) : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    {showActions && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
                </TableHeader>
                <TableBody>
                {leaves.length === 0 ? (
                    <TableRow>
                    <TableCell colSpan={showActions ? 5 : 4} className="text-center py-8">
                        No leave requests found
                    </TableCell>
                    </TableRow>
                ) : (
                    leaves.map((leave) => (
                    <TableRow key={leave.id}>
                        <TableCell className="font-medium">
                        {getLeaveTypeLabel(leave.type)}
                        </TableCell>
                        <TableCell>{formatDate(leave.startDate)}</TableCell>
                        <TableCell>{formatDate(leave.endDate)}</TableCell>
                        <TableCell>
                        <Badge className={getStatusBadgeColor(leave.status)}>
                            {leave.status}
                        </Badge>
                        </TableCell>
                        {showActions && leave.status === LeaveStatus.PENDING && (
                        <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApprove(leave.id)}
                            >
                                <Check className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReject(leave.id)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                            </div>
                        </TableCell>
                        )}
                    </TableRow>
                    ))
                )}
                </TableBody>
            </Table>
            )}
        </CardContent>
        </Card>
    )
    }