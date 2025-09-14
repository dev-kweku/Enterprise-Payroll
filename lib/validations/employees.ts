    import { z } from 'zod'

    export const employeeSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    ssnitNumber: z.string().min(1, 'SSNIT number is required'),
    taxId: z.string().min(1, 'Tax ID is required'),
    bankName: z.string().min(1, 'Bank name is required'),
    bankAccount: z.string().min(1, 'Bank account is required'),
    department: z.string().optional(),
    position: z.string().optional(),
    hireDate: z.date().optional(),
    managerId: z.string().optional(),
    salary: z.object({
        baseSalary: z.number().min(0, 'Base salary must be a positive number'),
        allowances: z.number().min(0, 'Allowances must be a positive number'),
        deductions: z.number().min(0, 'Deductions must be a positive number'),
        tier2: z.number().min(0, 'Tier 2 must be a positive number'),
        tier3: z.number().min(0, 'Tier 3 must be a positive number'),
    }).optional(),
    })