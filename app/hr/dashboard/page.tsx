    'use client'

    import { useSession } from 'next-auth/react'
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
    import { Users, FileText, Calendar, DollarSign } from 'lucide-react'

    export default function HrDashboard() {
    const { data: session } = useSession()

    return (
        <div>
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
            Welcome back, {session?.user?.email}
            </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                +2 from last month
                </p>
            </CardContent>
            </Card>

            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payroll Runs</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                Last run: 2 days ago
                </p>
            </CardContent>
            </Card>

            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leave Requests</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                3 pending approval
                </p>
            </CardContent>
            </Card>

            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Documents</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">48</div>
                <p className="text-xs text-muted-foreground">
                +12 from last month
                </p>
            </CardContent>
            </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
            <CardHeader>
                <CardTitle>Recent Payroll Runs</CardTitle>
                <CardDescription>
                Your latest payroll processing activities
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-center">
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                        Payroll for May 2023
                        </p>
                        <p className="text-sm text-muted-foreground">
                        Processed on May 31, 2023
                        </p>
                    </div>
                    <div className="ml-auto font-medium">GHS 48,250.00</div>
                    </div>
                ))}
                </div>
            </CardContent>
            </Card>

            <Card>
            <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>
                Leave requests and other items requiring your attention
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
        </div>
        </div>
    )
    }