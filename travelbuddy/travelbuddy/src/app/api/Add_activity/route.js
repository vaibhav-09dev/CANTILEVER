import destination from "@/app/Modal/Destination"
import {connect} from "@/app/db/db"
import user from "@/app/Modal/User"
import { NextResponse } from "next/server"



connect()

export async function POST(request) {
  try {
    const reqbody = await request.json()
    const { title, descp, type,date,time,location,id } = reqbody
    if(!title||!descp||!type||!date||!time||!location||!id) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }
   
    
    const existinguser=await user.findById(id)
    if (!Array.isArray(existinguser.activity)) {
            existinguser.activity = [];
        }
     const activities = new destination({
         title: title,
         descp: descp,
         type: type,
         date: date,
         time: time,
         location: location,
         user:existinguser,
         })
      await activities.save();
      existinguser.activity.push(activities);
      await existinguser.save()
     return NextResponse.json({ message: "activity added successfully",  activities }, { status: 201 })

    
  } catch (error) {
    return NextResponse.json({ message: error.message , error: error.message }, { status: 201 })
    
  }    
    }
