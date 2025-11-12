// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail, generateToken } from '../../../utils/email';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName,
      middleInitial,         
      phoneNumber,
      addressLine,
      city,
      state,
      zipCode,
      usCitizen,
      driversLicense,
      reliableTransport,
      speakSpanish,
      referenceName,
      businessOrSchoolName,  
    } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, password, first name, and last name are required' },
        { status: 400 }
      );
    }


    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    const existingPerson = await prisma.person.findUnique({
      where: { emailAddress: email },
    });

    const existingVolunteer = await prisma.volunteer.findFirst({
      where: { emailAddress: email },
    });

    if (existingUser || existingPerson || existingVolunteer) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = generateToken();
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const result = await prisma.$transaction(async (prisma) => {
      const person = await prisma.person.create({
        data: {
          firstName,
          lastName,
          emailAddress: email,
          phoneNumber: phoneNumber,
        },
      });

      const volunteer = await prisma.volunteer.create({
        data: {
          firstName,
          middleInitial: middleInitial || null,
          lastName,
          emailAddress: email,
          phoneNumber: phoneNumber || 'Not provided',        
          addressLine: addressLine || 'Not provided',        
          city: city || 'Not provided',                      
          state: state || 'Not provided',                    
          zipCode: zipCode || '00000',                       
          usCitizen: usCitizen ?? null,
          driversLicense: driversLicense ?? null,
          reliableTransport: reliableTransport ?? null,
          speakSpanish: speakSpanish ?? null,
          referenceName: referenceName || null,
          businessOrSchoolName: businessOrSchoolName || null,
          registration: true, 
        },
      });

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'VOLUNTEER',
          verified: false,
          verificationToken,
          verificationExpiry,
          personId: person.id,
        },
      });

      return { user, person, volunteer };
    });

    await sendVerificationEmail(email, verificationToken, firstName);
    console.log('Email sent successfully to:', email);

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful. Please check your email to verify your account.',
        user: {
          id: result.user.id,
          email: result.user.email,
          verified: result.user.verified,
          firstName: result.person.firstName,
          lastName: result.person.lastName,
          volunteerId: result.volunteer.id, 
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
