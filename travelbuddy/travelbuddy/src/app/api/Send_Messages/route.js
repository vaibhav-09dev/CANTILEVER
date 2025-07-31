import { connect } from "@/app/db/db";
import { NextResponse } from "next/server";
import Message from "@/app/Modal/Message";

connect(); // Optional: can be inside handler instead

export async function POST(request) {
  try {
    const { from, to, message } = await request.json();

    if (!from || !to || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const msg = await Message.create({ from, to, message });

    return NextResponse.json({ success: true, message: msg }, { status: 201 });
  } catch (err) {
    console.error("Message Save Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
