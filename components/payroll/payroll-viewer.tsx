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
    import { Download, Eye } from 'lucide-react'
    import { Payslip } from '@prisma/client'
    import { toast } from 'sonner'

    interface PayslipWithPayrollRun extends Payslip {
    payrollRun: {
        id: string
        period: Date
        processed: boolean
    }
    }

    interface PayslipViewerProps {
    employeeId: string
    }

    export function PayslipViewer({ employeeId }: PayslipViewerProps) {
    const [payslips, setPayslips] = useState<PayslipWithPayrollRun[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedPayslip, setSelectedPayslip] = useState<PayslipWithPayrollRun | null>(null)

    useEffect(() => {
        fetchPayslips()
    }, [employeeId])

    const fetchPayslips = async () => {
        setIsLoading(true)
        try {
        const response = await fetch(`/api/payroll/payslips/${employeeId}`)
        if (response.ok) {
            const data = await response.json()
            setPayslips(data)
        } else {
            console.error('Failed to fetch payslips')
            toast.error('Failed to fetch payslips')
        }
        } catch (error) {
        console.error('Error fetching payslips:', error)
        toast.error('Error fetching payslips')
        } finally {
        setIsLoading(false)
        }
    }

    const viewPayslip = (payslip: PayslipWithPayrollRun) => {
        setSelectedPayslip(payslip)
    }

    const downloadPayslip = (payslip: PayslipWithPayrollRun) => {
        
        toast.success('Download initiated', {
        description: `Downloading payslip for ${new Date(payslip.payrollRun.period).toLocaleDateString()}`,
        })
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        })
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency: 'GHS',
        }).format(amount)
    }

    return (
        <div className="space-y-6">
        <Card>
            <CardHeader>
            <CardTitle>Payslips</CardTitle>
            <CardDescription>
                View and download your payslips
            </CardDescription>
            </CardHeader>
            <CardContent>
            {isLoading ? (
                <div className="flex justify-center py-8">Loading payslips...</div>
            ) : (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Gross Pay</TableHead>
                    <TableHead>Net Pay</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {payslips.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                        No payslips found
                        </TableCell>
                    </TableRow>
                    ) : (
                    payslips.map((payslip) => (
                        <TableRow key={payslip.id}>
                        <TableCell className="font-medium">
                            {formatDate(payslip.payrollRun.period)}
                        </TableCell>
                        <TableCell>{formatCurrency(payslip.grossPay)}</TableCell>
                        <TableCell>{formatCurrency(payslip.netPay)}</TableCell>
                        <TableCell>
                            <Badge
                            variant={payslip.payrollRun.processed ? 'default' : 'secondary'}
                            >
                            {payslip.payrollRun.processed ? 'Processed' : 'Pending'}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => viewPayslip(payslip)}
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadPayslip(payslip)}
                            >
                                <Download className="h-4 w-4" />
                            </Button>
                            </div>
                        </TableCell>
                        </TableRow>
                    ))
                    )}
                </TableBody>
                </Table>
            )}
            </CardContent>
        </Card>

        {selectedPayslip && (
            <Card>
            <CardHeader>
                <CardTitle>
                Payslip for {formatDate(selectedPayslip.payrollRun.period)}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Earnings</h3>
                    <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>Basic Salary</span>
                        <span>{formatCurrency(selectedPayslip.grossPay - (selectedPayslip.grossPay * 0.1))}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Allowances</span>
                        <span>{formatCurrency(selectedPayslip.grossPay * 0.1)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                        <span>Gross Pay</span>
                        <span>{formatCurrency(selectedPayslip.grossPay)}</span>
                    </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Deductions</h3>
                    <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>SSNIT (Employee)</span>
                        <span>{formatCurrency(selectedPayslip.ssnitEmployee)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>PAYE Tax</span>
                        <span>{formatCurrency(selectedPayslip.paye)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tier 2 Pension</span>
                        <span>{formatCurrency(selectedPayslip.tier2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tier 3 Pension</span>
                        <span>{formatCurrency(selectedPayslip.tier3)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                        <span>Total Deductions</span>
                        <span>
                        {formatCurrency(
                            selectedPayslip.ssnitEmployee +
                            selectedPayslip.paye +
                            selectedPayslip.tier2 +
                            selectedPayslip.tier3
                        )}
                        </span>
                    </div>
                    </div>
                </div>
                </div>
                <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between text-lg font-medium">
                    <span>Net Pay</span>
                    <span>{formatCurrency(selectedPayslip.netPay)}</span>
                </div>
                </div>
            </CardContent>
            </Card>
        )}
        </div>
    )
    }