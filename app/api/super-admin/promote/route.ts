import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/utils/db";

// UPDATE: Given a user id, get the user object and 
// 1. invalidate the connection to the previous user role (Volunteer, Admin) if it exists
// 1.5. Update the role of the user to SUPER_ADMIN
// 2. create a new SuperAdmin object with the user id and connect it to the user object
// 3. return a success message

export async function POST(request: NextRequest){
try {
console.log("YFTFTFVVB")
const {userID} = await request.json();
 console.log( userID);
// Step 1: Get the user object
const user = await prisma.user.findUnique({
    where: {id: userID},
    include: {
        person: true,
    }
})

if (!user) {
    return NextResponse.json({error: "User not found"}, {status: 404});

}

// Step 2: Invalidate previous role connections (Volunteer, Admin)

// if (user.role === "VOLUNTEER"){

// await prisma.volunteer.update({ 
//     where: {id: userID},
//     data: {isDeleted: true}
    
// })

// } 
// else if (user.role === "ADMIN"){

// await prisma.admin.update({
//     where: {id: userID},
//     data: {isDeleted: true}
// })

// } // uncomment and test by creating a new user, promoting them to admin, then promoting them to super admin. Check the database to see if the isDeleted field is updated correctly.

// update the role of the user to SUPER_ADMIN
await prisma.user.update({
    where: {id: userID},
    data: {role: "SUPER_ADMIN"}
})

//creating the super admin object and connecting it to the user object
const superAdmin= await prisma.superAdmin.create({
    data: {
        personId: user.person?.id
    }
})


// Step 3: Return success message
return NextResponse.json({ message: "Super Admin account created successfully", id: superAdmin.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating super admin account:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}