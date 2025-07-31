import user from "@/app/Modal/User"
import { connect } from "@/app/db/db"   
import { NextResponse } from "next/server"
connect();
export async function GET(request) {
     try {
        const {searchParams}=new URL(request.url)
        const id=searchParams.get("id")
        const currentUser = await user.findById(id)
        if(!currentUser){
            return NextResponse.json({message:"User not found"},{status:404})
        }
        return NextResponse.json({message:"User fetched successfully",data:currentUser},{status:200})

     } catch (error) {
        return NextResponse.json({ message: "Error fetching users", error: error.message }, { status: 500 })
     }
}