import connect from "@/lib/db";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  await connect();
  try {
    const body = await request.json();
    const email = body.email;
    const fullname = body.fullname;
    const phoneNumber = body.phoneNumber;
    const role = body.role;
    const user = await User.findOne({ email });
    const fname = await User.findOne({ fullname });
    const phoneNum = await User.findOne({ phoneNumber });

    if (fname) {
      return new NextResponse(
        JSON.stringify({
          message: "User already exit with the name.",
        }),
        { status: 400 }
      );
    }

    if (user) {
      return new NextResponse(
        JSON.stringify({
          message: "User already exit with the email.",
        }),
        { status: 400 }
      );
    }

    if (phoneNum) {
      return new NextResponse(
        JSON.stringify({
          message: "User already exit with the phone number.",
        }),
        { status: 400 }
      );
    }

    if (role === 'customer') {
      const newCustomer = new User(body);
      await newCustomer.save();

      return new NextResponse(
        JSON.stringify({ message: "Customer created successfully", customer: newCustomer }),
        { status: 200 }
      );
    }

    if (role === "vendor") {
      const newVendor = new User(body);
      await newVendor.save();

      return new NextResponse(
        JSON.stringify({ message: "Vendor created successfully", vendor: newVendor }),
        { status: 200 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Invalid form request.",
      }),
      { status: 400 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: `Opps! Something went wrong. ${error.message}`,
      }),
      { status: 500 }
    );
  }
};
