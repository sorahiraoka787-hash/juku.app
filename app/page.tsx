"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      alert(error?.message || "ログイン失敗");
      return;
    }

    // 👇 profilesからrole取得
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    const role = profile?.role;

    if (role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/teacher");
    }
  };

  return (
    <main className="flex items-center justify-center h-screen">

      <div className="border p-6 rounded space-y-4 w-80">

        <h1 className="text-xl font-bold text-center">
          Login
        </h1>

        <input
          className="border p-2 w-full"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          ログイン
        </button>

      </div>

    </main>
  );
}