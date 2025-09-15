    'use client'

    import { PayrollRun } from '@/components/payroll/payroll-run'
    import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

    export default function PayrollPage() {
    return (
        <div>
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
            <p className="mt-2 text-sm text-gray-600">
            Process payroll and manage payslips
            </p>
        </div>

        <Tabs defaultValue="run" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="run">Run Payroll</TabsTrigger>
            <TabsTrigger value="history">Payroll History</TabsTrigger>
            </TabsList>
            <TabsContent value="run" className="space-y-4">
            <PayrollRun />
            </TabsContent>
            <TabsContent value="history" className="space-y-4">
            <div className="text-center py-12">
                <p className="text-gray-500">Payroll history will be displayed here</p>
            </div>
            </TabsContent>
        </Tabs>
        </div>
    )
    }