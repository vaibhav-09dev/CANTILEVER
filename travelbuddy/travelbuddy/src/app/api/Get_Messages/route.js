import { connect } from "@/app/db/db";
import { NextResponse } from "next/server";
import Message from "@/app/Modal/Message";

export async function GET(request) {
  try {
    await connect();

    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!from || !to) {
      return NextResponse.json({ error: "Missing 'from' or 'to' query parameter" }, { status: 400 });
    }

    const messages = await Message.find({
      $or: [
        { from, to },
        { from: to, to: from }
      ]
    }).sort({ timestamp: 1 });
    await Message.updateMany(
      { from: to, to: from, read: false },
      { $set: { read: true } }
    );

    return NextResponse.json({ success: true, messages });
  } catch (err) {
    console.error("Fetch Messages Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
