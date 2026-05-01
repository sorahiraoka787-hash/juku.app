"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    // ① ログイン
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error || !data.session) {
      console.error("ログインエラー:", error);
      alert("ログイン失敗");
      setLoading(false);
      return;
    }

    const user = data.user;

    // ② 権限取得（ここが修正ポイント）
    const { data: profile, error: roleError } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    console.log("user:", user);
    console.log("profile:", profile);
    console.log("roleError:", roleError);

    setLoading(false);

    if (roleError || !profile) {
      alert("権限取得エラー");
      return;
    }

    // ③ 画面遷移
    if (profile.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/teacher");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F6F8F7]">
      <div className="w-80 space-y-4">

        <h1 className="text-xl font-bold text-center">
          ログイン
        </h1>

        <input
          className="border p-2 w-full rounded"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full rounded"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-600 text-white w-full p-2 rounded"
        >
          {loading ? "ログイン中..." : "ログイン"}
        </button>

      </div>
    </main>
  );
}