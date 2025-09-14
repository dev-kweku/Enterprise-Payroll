    import { z } from 'zod'

    export const leaveSchema = z.object({
    type: z.enum(['ANNUAL', 'SICK', 'UNPAID', 'MATERNITY', 'PATERNITY']),
    startDate: z.date(),
    endDate: z.date(),
    reason: z.string().optional(),
    }).refine((data) => data.endDate >= data.startDate, {
    message: "End date must be after start date",
    path: ['endDate'],
    })