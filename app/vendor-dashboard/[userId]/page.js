"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { getCookie } from "cookies-next";
import LoadingScreen from "@/app/loading";

export default function Page() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const jwt = getCookie("jwt");
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(true);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    setIsSuccess(false);
    const fetchUser = async () => {
      try {
        const user = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/auth/dashboard?userId=${userId}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );

        if (user.status !== 200) {
          setIsSuccess(false);
          window.alert(user.message);
          router.push("/login");
          return;
        }

        // if OK.
        if (
          user.status === 200 &&
          user.data.profile.role === "vendor"
        ) {
          setUserInfo(user.data.profile);
          setIsSuccess(true);
          window.alert(user.data.message);
          return;
        }
      } catch (error) {
        window.alert("Authorization Failed!");
        setIsSuccess(false);
        router.push("/login");
        return;
      }
    };
    fetchUser();
  }, [userId]);

  if (!isSuccess) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black text-white font-[family-name:var(--font-geist-sans)]">
      <span className="font-bold text-xl">
        Welcome back, <span className="text-red-600">{userInfo.fullname}</span>
      </span>
      <div>
        Account Type: <span className="text-red-600">{userInfo.role}</span>
      </div>
    </div>
  );
}
