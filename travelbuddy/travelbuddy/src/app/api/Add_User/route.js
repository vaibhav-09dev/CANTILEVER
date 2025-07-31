
import user from "@/app/Modal/User"
import {connect} from "@/app/db/db"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"


connect()

export async function POST(request) {
  try {
    const reqbody = await request.json()
    const { name, email, password,about,location,age,occupation } = reqbody
    if(!name ||!email ||!password||!about ||!location ||!age ||!occupation) {
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
         password: hashedPassword,
         about: about,
         location: location,
         age: age,
         occupation: occupation,})
     const savedUser = await newUser.save()
     return NextResponse.json({ message: "User added successfully", user: savedUser }, { status: 201 })

    
  } catch (error) {
    return NextResponse.json({ message: "Error adding user", error: error.message }, { status: 201 })
    
  }    
    }
