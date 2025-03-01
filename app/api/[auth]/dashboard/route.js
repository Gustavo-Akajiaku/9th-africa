import connect from "@/lib/db";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

const ObjectId = require("mongoose").Types.ObjectId;

// FETCH USER INFO
export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse(
        JSON.stringify({
          message: "ID not found",
        }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid user ID" }), {
        status: 400,
      });
    }
    
    await connect();
    const user = await User.findById(userId);

    if (user.role === "vendor") {
      return new NextResponse(
        JSON.stringify({
          message: "Vendor profile retrieved successfully",
          profile: user,
        }),
        { status: 200 }
      );
    }

    if (user.role === "customer") {
      return new NextResponse(
        JSON.stringify({
          message: "Customer profile retrieved successfully",
          profile: user,
        }),
        { status: 200 }
      );
    }
  } catch (error) {
    return new NextResponse("Error in fetching users" + error.message, {
      status: 500,
    });
  }
};