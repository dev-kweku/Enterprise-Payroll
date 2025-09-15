    'use client'

    import { useSession } from 'next-auth/react'
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
    import { Users, FileText, Calendar, DollarSign } from 'lucide-react'

    export default function ManagerDashboard() {
    const { data: session } = useSession()

    return (
        <div>
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
            Welcome back, {session?.user?.email}
            </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                +1 from last month
                </p>
            </CardContent>
            </Card>

            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Payroll</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">GHS 24,500</div>
                <p className="text-xs text-muted-foreground">
                Monthly budget
                </p>
            </CardContent>
            </Card>

            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leave Requests</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                Pending approval
                </p>
            </CardContent>
            </Card>

            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Performance</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">
                Team productivity
                </p>
            </CardContent>
            </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
            <CardHeader>
                <CardTitle>Team Leave Requests</CardTitle>
                <CardDescription>
                Leave requests from your team members
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center">
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                        John Doe - Annual Leave
                        </p>
                        <p className="text-sm text-muted-foreground">
                        Jun 15 - Jun 20, 2023
                        </p>
                    </div>
                    <div className="ml-auto">
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Pending
                        </span>
                    </div>
                    </div>
                ))}
                </div>
            </CardContent>
            </Card>

            <Card>
            <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>
                Overview of your team&apos;s performance metrics
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-center">
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                        Team Member {item}
                        </p>
                        <p className="text-sm text-muted-foreground">
                        {item === 1 ? '95%' : item === 2 ? '92%' : item === 3 ? '88%' : '90%'} completion rate
                        </p>
                    </div>
                    <div className="ml-auto">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        On Track
                        </span>
                    </div>
                    </div>
                ))}
                </div>
            </CardContent>
            </Card>
        </div>
        </div>
    )
    }