import Message from "@/app/Modal/Message";
import { connect } from "@/app/db/db";
import { NextResponse } from "next/server";

connect();

// GET unread counts per sender
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userIdfrom");

  try {
    const unreadCounts = await Message.aggregate([
      { $match: { to: userId, read: false } },
      {
        $group: {
          _id: "$from",
          count: { $sum: 1 },
        },
      },
    ]);

    const formatted = unreadCounts.map((item) => ({
      userId: item._id,
      count: item.count,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("Error getting unread counts:", err);
    return NextResponse.json({ error: "Failed to get unread counts" }, { status: 500 });
  }
}

// PUT mark all as read from specific user
export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const to = url.searchParams.get("to");
    const from = url.searchParams.get("from");

    await Message.updateMany(
      { from, to, read: false },
      { $set: { read: true } }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error marking messages as read:", err);
    return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 });
  }
}
