import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    const body = await request.json()
    const {email, name, password} = body //body bata model ma hamile banako email, name, password jhikem.

    if(!email || !name || !password) {
        return NextResponse.json({message: "All fields are required invalid body"}, {status: 400})
    }

    const hashedPassword = await bcrypt.hash(password, 12) //salting length 12 
    //database ma set create garnalai set garam data.

    try {
    const user = await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
        }
    })

    return NextResponse.json({message: "User created successfully", user}, {status: 201})
} catch (error) {
    console.log(error)
    return NextResponse.json({message: "User creation failed"}, {status: 400})
}
}

//localhost:3001/api/register ma body ma {"email": "sHh6v@example.com", "name": "John Doe", "password": "password"} rakhera post request garum.