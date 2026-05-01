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
    console.log("① クリックされた");

    try {
      setLoading(true);

      // ログイン
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      console.log("② auth結果", { data, error });

      if (error || !data.session) {
        alert("ログイン失敗");
        return;
      }

      const user = data.user;
      console.log("③ user", user);

      // 管理者メール
      const adminEmail = "sorahiraoka787@gmail.com";

      // 画面遷移
      if (user.email === adminEmail) {
  window.location.href = "/admin";
} else {
  window.location.href = "/teacher";
}

    } catch (e) {
      console.error("エラー:", e);
      alert("エラー発生");
    } finally {
      setLoading(false); // ← これでボタン固まらない
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
          type="button"
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