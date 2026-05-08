import "./globals.css";
import Link from "next/link";
import HeaderAuth from "@/components/HeaderAuth";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>

        {/* ヘッダー */}
        <header className="border-b p-4 flex justify-between items-center bg-white">

          {/* 左：タイトル */}
          <div className="font-bold">
            Lesson SaaS
          </div>

          {/* 右：認証付きメニュー */}
          <HeaderAuth />

        </header>

        {/* 本体 */}
        <main>{children}</main>

      </body>
    </html>
  );
}