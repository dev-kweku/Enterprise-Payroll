    'use client'

    import { useSession } from 'next-auth/react'
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
    import { FileText, Calendar, DollarSign, User } from 'lucide-react'

    export default function EmployeeDashboard() {
    const { data: session } = useSession()

    return (
        <div>
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
            Welcome back, {session?.user?.email}
            </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">100%</div>
                <p className="text-xs text-muted-foreground">
                Profile complete
                </p>
            </CardContent>
            </Card>

            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Salary</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">GHS 3,500</div>
                <p className="text-xs text-muted-foreground">
                Monthly net pay
                </p>
            </CardContent>
            </Card>

            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">
                Days remaining
                </p>
            </CardContent>
            </Card>

            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payslips</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                Available for download
                </p>
            </CardContent>
            </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
            <CardHeader>
                <CardTitle>Recent Payslips</CardTitle>
                <CardDescription>
                Your latest payslips available for download
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-center">
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                        Payslip for May 2023
                        </p>
                        <p className="text-sm text-muted-foreground">
                        Net Pay: GHS 3,250.00
                        </p>
                    </div>
                    <div className="ml-auto">
                        <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Download
                        </button>
                    </div>
                    </div>
                ))}
                </div>
            </CardContent>
            </Card>

            <Card>
            <CardHeader>
                <CardTitle>Leave History</CardTitle>
                <CardDescription>
                Your recent leave requests and their status
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center">
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                        {item === 1 ? 'Annual Leave' : item === 2 ? 'Sick Leave' : 'Unpaid Leave'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                        {item === 1 ? 'Jun 15 - Jun 20, 2023' : item === 2 ? 'May 5 - May 7, 2023' : 'Apr 10 - Apr 12, 2023'}
                        </p>
                    </div>
                    <div className="ml-auto">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item === 1 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : item === 2 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                        {item === 1 ? 'Pending' : 'Approved'}
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