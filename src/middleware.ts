
import { jwtVerify } from "jose";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    console.log({pathname}) //localhost:3000/api/login ma request garum. tyo garda srever ma pathname log huncha.
    //pathname was '/api/login' 

    //yo 2 ta pathname ma middleware ko logic lagauna parena. token bina user le access paune vayo.
    //yedi dashboard lai protected route banauna xoina vane yeha pathname ma rakhda huncha.

    if(pathname === '/api/login' || pathname === '/api/register') {
        return
    }

    const h = headers()
    const token = h.get('Authorization')

    if(!token) {
        return NextResponse.json({message: "Unauthorized user"}, {status: 401})
    }
    console.log({token}) //aru path ma jada token log huncha. if not token null aaucha
    //localhost:3001/api/dashboard ma without token post request garum. {message: "unauthorized user"} aaucha.
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)

    const {payload} = await jwtVerify(token, secret) 

    //console.log({payload})

    if(!payload?.id) {
        return NextResponse.json(
            {message: "invalid user"}, 
            {status: 401}) 
        }


    // const user = await prisma.user.findFirst({
    //     where: {
    //         id: payload.id as string
    //     }
    // })

    // if(!user) {
    //     return NextResponse.json({message: "invalid user"}, {status: 401})
    // }

    // if(user?.id) {
    //   return
    // }
}