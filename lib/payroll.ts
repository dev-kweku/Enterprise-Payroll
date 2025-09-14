    import { prisma } from './db'

    
    const taxBrackets = [
    { min: 0, max: 365, rate: 0 },
    { min: 366, max: 500, rate: 5 },
    { min: 501, max: 3000, rate: 10 },
    { min: 3001, max: 5000, rate: 17.5 },
    { min: 5001, max: 10000, rate: 25 },
    { min: 10001, max: 20000, rate: 30 },
    { min: 20001, max: Infinity, rate: 35 },
    ]

    
    const SSNIT_EMPLOYEE_RATE = 0.055 // 5.5%
    const SSNIT_EMPLOYER_RATE = 0.13 // 13%


    const TIER2_RATE = 0.05 // 5%
    const TIER3_RATE = 0.05 // 5%

    export interface PayrollCalculation {
    grossPay: number
    ssnitEmployee: number
    ssnitEmployer: number
    tier2: number
    tier3: number
    taxableIncome: number
    paye: number
    netPay: number
    }

    export async function calculatePayroll(employeeId: string): Promise<PayrollCalculation> {
    const employee = await prisma.employee.findUnique({
        where: { id: employeeId },
        include: { salary: true },
    })

    if (!employee || !employee.salary) {
        throw new Error('Employee or salary information not found')
    }

    const { baseSalary, allowances, deductions, tier2, tier3 } = employee.salary
    const grossPay = baseSalary + allowances


    const ssnitEmployee = grossPay * SSNIT_EMPLOYEE_RATE
    const ssnitEmployer = grossPay * SSNIT_EMPLOYER_RATE


    const tier2Contribution = grossPay * TIER2_RATE
    const tier3Contribution = grossPay * TIER3_RATE


    const taxableIncome = grossPay - ssnitEmployee

    // Calculate PAYE tax
    let paye = 0
    let remainingIncome = taxableIncome

    for (const bracket of taxBrackets) {
        if (remainingIncome <= 0) break

        const taxableInBracket = Math.min(
        remainingIncome,
        bracket.max === Infinity ? remainingIncome : bracket.max - bracket.min + 1
        )

        paye += taxableInBracket * (bracket.rate / 100)
        remainingIncome -= taxableInBracket
    }

    // Calculate net pay
    const netPay = grossPay - ssnitEmployee - paye - deductions - tier2Contribution - tier3Contribution

    return {
        grossPay,
        ssnitEmployee,
        ssnitEmployer,
        tier2: tier2Contribution,
        tier3: tier3Contribution,
        taxableIncome,
        paye,
        netPay,
    }
    }

    export async function runPayroll(period: Date) {
    // Get all employees with salary information
    const employees = await prisma.employee.findMany({
        include: { salary: true, user: true },
    })

    if (employees.length === 0) {
        throw new Error('No employees found')
    }

    // Create a new payroll run
    const payrollRun = await prisma.payrollRun.create({
        data: {
        period,
        processed: false,
        },
    })

    // Process payroll for each employee
    for (const employee of employees) {
        if (!employee.salary) continue

        try {
        const payrollCalc = await calculatePayroll(employee.id)

        // Create payslip
        await prisma.payslip.create({
            data: {
            employeeId: employee.id,
            payrollRunId: payrollRun.id,
            grossPay: payrollCalc.grossPay,
            paye: payrollCalc.paye,
            ssnitEmployee: payrollCalc.ssnitEmployee,
            ssnitEmployer: payrollCalc.ssnitEmployer,
            tier2: payrollCalc.tier2,
            tier3: payrollCalc.tier3,
            netPay: payrollCalc.netPay,
            },
        })
        } catch (error) {
        console.error(`Error processing payroll for employee ${employee.id}:`, error)
        }
    }

    // Mark payroll run as processed
    await prisma.payrollRun.update({
        where: { id: payrollRun.id },
        data: { processed: true },
    })

    return payrollRun
    }