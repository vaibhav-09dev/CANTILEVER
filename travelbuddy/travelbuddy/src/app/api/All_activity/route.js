import destination from "@/app/Modal/Destination";
import user from "@/app/Modal/User";
import { connect } from "@/app/db/db";
import { NextResponse } from "next/server";

connect();

export async function GET(request) {
  try {
    const all = await destination.find().populate("user", "name email avatar");

    if (!all || all.length === 0) {
      return NextResponse.json({ message: "No activities found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Activities fetched successfully", data: all }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Error fetching activities", error: error.message }, { status: 500 });
  }
}
