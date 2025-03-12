import { NextRequest, NextResponse } from 'next/server';
import { users } from '@/lib/user';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Validate inputs
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (users.some(user => user.email === email)) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // In a real app, you would hash the password before storing
    const newUser = {
      id: `${users.length + 1}`,
      name,
      email,
      password, // In production, use bcrypt to hash this
      role: 'user',
      image: '/images/avatar-placeholder.png',
      provider: 'credentials'
    };

    // Add to our "database"
    users.push(newUser);

    // Return success but don't include the password
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(
      { message: 'User registered successfully', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}