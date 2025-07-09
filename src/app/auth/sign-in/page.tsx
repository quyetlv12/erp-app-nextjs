import SigninWithPassword from "@/components/Auth/SigninWithPassword";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập",
};

export default function SignIn() {
  return (
    <SigninWithPassword />
  );
}
