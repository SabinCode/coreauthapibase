import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { create } from "domain";


export async function POST(request: NextRequest) {
    const body = await   request.json()
    const {email, password} = body //login ko lagi without name. email n password matra jhikem,

    //email or passowrd pathayena vane error msg with status 400
    if(!email || !password) {
        return NextResponse.json({message: "All fields are required invalid body"}, {status: 400})
   }

   //user jhikam (single user) with email
   const user = await prisma.user.findFirst({
    where: {
        email:email,
    }
   })

   //user vetena vane feri error msg with status 404

   if(!user) {
    return NextResponse.json({message: "User not found"}, {status: 404})
   }

   //check password, bcrypt lai manaully import garam
   const isValidPassword = await bcrypt.compare(password, user.password)

   if(!isValidPassword) {
    return NextResponse.json({message: "Invalid password"}, {status: 401})
   }

   //jwt token sangai user ko details paune vayo userle. yeha id matra rakhda ni huncha
   const tokenPayload = {
    id: user.id,
    name: user.name,
    email: user.email
   }

   //secretkey lai env file ma rakhem, tyo secretkey user garera hamile token create gareko
   const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
   const token = await new SignJWT(tokenPayload).setProtectedHeader({alg: 'HS256', typ: 'JWT'})
   .setExpirationTime('100days').sign(secret)

   //aba token sangai user pani pathaidiyem
   return NextResponse.json({...user, token}, {status: 200})


   
}

//localhost:3001/api/login ma body ma {"email": "sHh6v@example.com", "password": "password"} rakhera post request garum.
//request success huda token aaucha with user details