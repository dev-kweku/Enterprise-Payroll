    'use client'

    import { useState } from 'react'
    import { Button } from '@/components/ui/button'
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
    import { Label } from '@/components/ui/label'
    import { Input } from '@/components/ui/input'
    import { toast } from 'sonner'
    import { Calendar } from 'lucide-react'

    export function PayrollRun() {
    const [isLoading, setIsLoading] = useState(false)
    const [period, setPeriod] = useState(
        new Date().toISOString().split('T')[0] // Format as YYYY-MM-DD
    )

    const handleRunPayroll = async () => {
        setIsLoading(true)

        try {
        const response = await fetch('/api/payroll/run', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ period }),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Payroll run failed')
        }

        const data = await response.json()
        // Fixed toast usage
        toast.success('Payroll run successful', {
            description: `Payroll for ${new Date(period).toLocaleDateString()} has been processed`,
        })
        } catch (error) {
        // Fixed toast usage
        toast.error('Payroll run failed', {
            description: error instanceof Error ? error.message : 'Something went wrong',
        })
        } finally {
        setIsLoading(false)
        }
    }

    return (
        <Card>
        <CardHeader>
            <CardTitle>Run Payroll</CardTitle>
            <CardDescription>
            Process payroll for all employees for the selected period
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
            <Label htmlFor="period">Payroll Period</Label>
            <div className="flex">
                <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                    id="period"
                    type="month"
                    className="pl-10"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                />
                </div>
            </div>
            </div>
            <Button
            onClick={handleRunPayroll}
            disabled={isLoading}
            className="w-full"
            >
            {isLoading ? 'Processing payroll...' : 'Run Payroll'}
            </Button>
        </CardContent>
        </Card>
    )
    }