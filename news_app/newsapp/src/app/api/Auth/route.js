import {connect} from "@/app/db/db"
import bcrypt from "bcryptjs";
import users from "@/app/model/user"

import { NextResponse } from "next/server";
connect();

export  async function POST(request){
   try {
    const reqbody= await request.json()
    const {email,password}=reqbody
    if(!email||!password){
        return NextResponse.json({
            message:"Please provide valid details",
            success:false
        })
    }
    const existing= await users.findOne({email:email})
    if(!existing){
        return NextResponse.json({ 
            message:"user not found",
            success:"false"
        })
    }
    const pass= await bcrypt.compare(password,existing.password)
    if(!pass){
        return NextResponse.json({
            message:"Invalid Creditnails",
            success:false
        })
    }
    return NextResponse.json({
        message:"Login Sucessfully",
        success:true,
        data:existing,
        Object_id:existing._id
    })

    
   } catch (error) {
    return NextResponse.json({
        message:"internal error",
        success:false  ,
        error:error
    })
    
   }
}