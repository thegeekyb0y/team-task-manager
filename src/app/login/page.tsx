import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { authOptions } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return <AuthForm mode="login" />;
}
