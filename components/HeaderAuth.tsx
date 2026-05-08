"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HeaderAuth() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();

      const u = data.user;
      setUser(u);

      if (!u) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", u.id)
        .single();

      setRole(profile?.role || "");
    };

    fetchUser();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user) {
    return (
      <Link href="/login" className="text-sm">
        ログイン
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4 text-sm">

      <span className="text-gray-500">
        {role === "admin" ? "管理者" : "講師"}
      </span>

      <Link href="/teacher">Teacher</Link>

      {role === "admin" && (
        <Link href="/admin/dashboard">Admin</Link>
      )}

      <button
        onClick={logout}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        ログアウト
      </button>

    </div>
  );
}