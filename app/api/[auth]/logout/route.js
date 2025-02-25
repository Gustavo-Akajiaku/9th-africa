import { NextResponse } from "next/server";
import { cookies } from "next/headers";
const MAX_AGE = 14 * 24 * 3600000; // 30 days

export async function POST() {
  try {
    const cookieOptions = {
      httpOnly: false,
      secure: true,
      maxAge: -1,
      sameSite: "none",
    };

    // Remove cookies in the browser
    const cookieStore = await cookies();
    cookieStore.delete('jwt');

    // Send success response with token and user info
    return NextResponse.json(
      {
        message: "Logout successfully",
      },
      { status: 200}  // OK
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 } // FORBIDDEN or any other appropriate error
    );
  }
}
