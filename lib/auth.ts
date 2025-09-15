    import { NextAuthOptions } from 'next-auth'
    import CredentialsProvider from 'next-auth/providers/credentials'
    import { PrismaAdapter } from '@auth/prisma-adapter'
    import { prisma } from './db'
    import bcrypt from 'bcryptjs'
    import { Role } from '@prisma/client'

    export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as never,
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
        newUser: '/register',
    },
    providers: [
        CredentialsProvider({
        name: 'credentials',
        credentials: {
            email: { label: 'Email', type: 'email' },
            password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
            return null
            }

            const user = await prisma.user.findUnique({
            where: {
                email: credentials.email,
            },
            include: {
                employee: true,
            },
            })

            if (!user) {
            return null
            }

            const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
            )

            if (!isPasswordValid) {
            return null
            }

            // Create a name from employee first and last name, or use email as fallback
            const name = user.employee 
            ? `${user.employee.firstName} ${user.employee.lastName}`
            : user.email

            // Return a User object that matches NextAuth's expectations
            return {
            id: user.id,
            email: user.email,
            name: name, // Use the constructed name
            role: user.role,
            employeeId: user.employee?.id || null,
            }
        },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
        if (user) {
            token.role = user.role
            token.employeeId = user.employeeId
        }
        return token
        },
        async session({ session, token }) {
        if (token) {
            session.user.id = token.sub!
            session.user.role = token.role as Role
            session.user.employeeId = token.employeeId as string | null
        }
        return session
        },
    },
    }