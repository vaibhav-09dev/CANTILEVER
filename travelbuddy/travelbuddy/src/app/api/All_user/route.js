import user from "@/app/Modal/User"
import { connect } from "@/app/db/db"
import { NextResponse } from "next/server"

connect()

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ message: "User id is required" }, { status: 400 })
    }
    // Find all users except the current user
    const users = await user.find({ _id: { $ne: id } })
    if (!users || users.length === 0) {
      return NextResponse.json({ message: "No users found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Users fetched successfully", data: users }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Error fetching users", error: error.message }, { status: 500 })
  }
}