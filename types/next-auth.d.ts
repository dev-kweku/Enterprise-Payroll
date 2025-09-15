    // Add this to your next-auth.d.ts file (create it if it doesn't exist)
    import NextAuth from 'next-auth'
    import { Role } from '@prisma/client'

    declare module 'next-auth' {
    interface User {
        role: Role
        employeeId: string | null
    }

    interface Session {
        user: {
        id: string
        email: string
        name: string
        role: Role
        employeeId: string | null
        }
    }
    }

    declare module 'next-auth/jwt' {
    interface JWT {
        role: Role
        employeeId: string | null
    }
    }