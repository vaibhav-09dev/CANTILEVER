import user from "@/app/Modal/User"
import {connect} from "@/app/db/db"
import { NextResponse } from "next/server"
import destination from "@/app/Modal/Destination"
import cloudinary from "@/lib/cloudinary"
connect()
export async function POST(request) {
    try {
        const reqbody=await request.json()
        const {about,location,age,occupation,id,pic}= reqbody
        if(!about||!location||!age||!occupation) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 })
        }
        const image= await cloudinary.uploader.upload(pic)
        const updateuser=await user.findByIdAndUpdate(id,{
            
            about:about,
            location:location,
            age:age,
            occupation:occupation,
            pic:image.secure_url
        })

    if(!updateuser) {
        return NextResponse.json({ message: "User not found" }, { status: 404 })}

    return NextResponse.json({ message: "User updated successfully", data:updateuser }, { status: 200 })

        
    } catch (error) {
        return NextResponse.json({ message: error.message, error: error.message }, { status: 500 })
        
    }

}