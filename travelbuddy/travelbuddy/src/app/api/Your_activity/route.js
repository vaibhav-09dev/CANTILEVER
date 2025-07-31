import destination from "@/app/Modal/Destination"
import user from "@/app/Modal/User"
import {connect} from "@/app/db/db"
import { NextResponse } from "next/server"

connect()
export async function GET(request){
    try {
        const {searchParams} = new URL(request.url)
        const id= searchParams.get("id")
        const activity = await destination.find({ user: id })
        
        if(!activity) {
            return NextResponse.json({ message: "Activity not found" }, { status: 404 })
        }   
        
        if(activity.length === 0) {
            return NextResponse.json({ message: "No activities found for this user" }, { status: 404 })
        }
        return NextResponse.json({ message: "Activities fetched successfully", data:activity }, { status: 200 })
        
    } catch (error) {
        return NextResponse.json({ message: "Error fetching activities", error: error.message }, { status: 500 })
    }
}