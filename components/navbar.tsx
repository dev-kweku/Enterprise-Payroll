    'use client'

    import { useSession, signOut } from 'next-auth/react'
    import Link from 'next/link'
    import { usePathname } from 'next/navigation'
    import { Button } from '@/components/ui/button'
    import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    } from '@/components/ui/dropdown-menu'
    import { User, LogOut, Settings, Home, Users, FileText, Calendar } from 'lucide-react'

    export function Navbar() {
    const { data: session } = useSession()
    const pathname = usePathname()

    if (!session) return null

    const getNavItems = () => {
        const role = session.user.role

        const baseItems = [
        {
            label: 'Dashboard',
            href: `/${role.toLowerCase()}/dashboard`,
            icon: Home,
        },
        ]

        if (role === 'ADMIN' || role === 'HR') {
        baseItems.push(
            {
            label: 'Employees',
            href: `/${role.toLowerCase()}/employees`,
            icon: Users,
            },
            {
            label: 'Payroll',
            href: `/${role.toLowerCase()}/payroll`,
            icon: FileText,
            }
        )
        }

        if (role === 'MANAGER') {
        baseItems.push(
            {
            label: 'Leave Approvals',
            href: `/${role.toLowerCase()}/leave-approvals`,
            icon: Calendar,
            }
        )
        }

        if (role === 'EMPLOYEE') {
        baseItems.push(
            {
            label: 'Payslips',
            href: `/${role.toLowerCase()}/payslips`,
            icon: FileText,
            },
            {
            label: 'Leave',
            href: `/${role.toLowerCase()}/leave`,
            icon: Calendar,
            }
        )
        }

        return baseItems
    }

    const navItems = getNavItems()

    return (
        <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
            <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-indigo-600">
                    Ghana Payroll
                </Link>
                </div>
                <nav className="ml-6 flex space-x-8">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive
                            ? 'border-indigo-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
                    >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.label}
                    </Link>
                    )
                })}
                </nav>
            </div>
            <div className="flex items-center">
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                        {session.user.email}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                        {session.user.role}
                        </p>
                    </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
            </div>
        </div>
        </header>
    )
    }