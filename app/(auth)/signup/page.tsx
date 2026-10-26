import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

export const metadata = { title: "Create your account", robots: { index: false } };
export default function Signup() {
  return <Suspense><AuthForm mode="signup" /></Suspense>;
}
