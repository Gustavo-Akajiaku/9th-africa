import connect from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "@/lib/models/user"; 

const MAX_AGE = 14 * 24 * 3600000; // 30 days

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Check if email and password are provided
    if (email === "" || password === "") {
      return NextResponse.json(
        { message: "Provide login credentials" },
        { status: 400 } // BAD_REQUEST
      );
    }

    await connect();

    // Find the user by email, including the password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json(
        { message: "You have not registered yet" },
        { status: 404 } // NOT_FOUND
      );
    }


    // Validate password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "The password provided is incorrect" },
        { status: 400 } 
      );
    }

    // Generate JWT token
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d", // Token expiry
    });

    const cookieOptions = {
      httpOnly: false,
      secure: true,
      maxAge: MAX_AGE,
      sameSite: "none",
    };

    // Set cookies in the browser
    const cookieStore = await cookies();
    const token = cookieStore.set("jwt", accessToken, cookieOptions);

    // Remove password from the returned user data
    const { password: userPassword, ...otherFields } = user.toObject();

    if (user.role === "vendor") {
      // Send success response with token and user info
      return NextResponse.json(
        {
          message: "Sign-In Successfully as a Vendor.",
          token: accessToken,
          data: {
            vendor: user, // You can adjust this if you have specific profile info
          },
        },
        {
          status: 200,
          headers: {
            "Set-Cookie": `jwt=${accessToken}`,
            Authorization: accessToken,
          },
        } // OK
      );
    }

    if (user.role === "customer") {
      // Send success response with token and user info
      return NextResponse.json(
        {
          message: "Sign-In Successfully as a Customer.",
          token: accessToken,
          data: {
            customer: user, // You can adjust this if you have specific profile info
          },
        },
        {
          status: 200,
          headers: {
            "Set-Cookie": `jwt=${accessToken}`,
            Authorization: accessToken,
          },
        } // OK
      );
    }

  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 } // FORBIDDEN or any other appropriate error
    );
  }
}
