    import NextAuth from 'next-auth'
    import { Role } from '@prisma/client'

    declare module 'next-auth' {
    interface Session {
        user: {
        id: string
        email: string
        role: Role
        employeeId: string | null
        }
    }

    interface User {
        role: Role
        employeeId: string | null
    }
    }

    declare module 'next-auth/jwt' {
    interface JWT {
        role: Role
        employeeId: string | null
    }
    }