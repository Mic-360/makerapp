import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, firstName, lastName, mobile, userType, industry, purpose } = body;

        // Here you would typically:
        // 1. Validate input
        // 2. Hash password
        // 3. Store user in database
        // 4. Create session or token
        // For now, we'll simulate success

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return NextResponse.json({
            success: true,
            user: {
                id: Math.random().toString(36).substr(2, 9),
                email,
                name: `${firstName} ${lastName}`,
                mobile,
                userType,
                industry,
                purpose
            }
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create account' },
            { status: 500 }
        );
    }
}