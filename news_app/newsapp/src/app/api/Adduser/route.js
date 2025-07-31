import user from "@/app/model/user"
import {connect} from "@/app/db/db"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"


connect()

export async function POST(request) {
  try {
    const reqbody = await request.json()
    const { name, email, password } = reqbody
    if(!name ||!email ||!password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }
   const existingUser = await user.findOne({ email })
   if (existingUser) {
     return NextResponse.json({ message: "User with this email already exists" }, { status: 400 })
   }
    
     const hashedPassword = await bcrypt.hash(password, 10)
     const newUser = new user({
         name: name,
         email: email,
         password: hashedPassword,})
     const savedUser = await newUser.save()
     return NextResponse.json({ message: "User added successfully", user: savedUser }, { status: 201 })

    
  } catch (error) {
    return NextResponse.json({ message: "Error adding user", error: error.message }, { status: 201 })
    
  }    
    }
