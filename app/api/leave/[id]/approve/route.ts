    import { NextRequest, NextResponse } from 'next/server'
    import { getServerSession } from 'next-auth'
    import { authOptions } from '@/lib/auth'
    import { prisma } from '@/lib/db'
    import { Role } from '@prisma/client'

    export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
    ) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Only Managers and HR can approve/reject leave
        if (session.user.role !== Role.MANAGER && session.user.role !== Role.HR) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()
        const { status } = body

        if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
        return NextResponse.json(
            { error: 'Valid status (APPROVED or REJECTED) is required' },
            { status: 400 }
        )
        }

        // Check if leave exists
        const leave = await prisma.leave.findUnique({
        where: { id: params.id },
        include: { employee: true },
        })

        if (!leave) {
        return NextResponse.json(
            { error: 'Leave request not found' },
            { status: 404 }
        )
        }

        // Managers can only approve/reject leave of their subordinates
        if (
        session.user.role === Role.MANAGER &&
        leave.employee.managerId !== session.user.employeeId
        ) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Update leave status
        const updatedLeave = await prisma.leave.update({
        where: { id: params.id },
        data: { status },
        })

        return NextResponse.json({
        leave: {
            id: updatedLeave.id,
            type: updatedLeave.type,
            startDate: updatedLeave.startDate,
            endDate: updatedLeave.endDate,
            status: updatedLeave.status,
            updatedAt: updatedLeave.updatedAt,
        },
        })
    } catch (error) {
        console.error('Approve/reject leave error:', error)
        return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
        )
    }
    }