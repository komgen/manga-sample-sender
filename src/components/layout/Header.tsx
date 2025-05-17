import Link from "next/link";

export function Header() {
  return (
    <header className="bg-manga-primary text-white">
      <div className="container mx-auto py-4">
        {/* サイト全体のタイトルを変更 */}
        <h1 className="text-xl font-bold">
          UKSSS-01（宇宙兄弟サンプル送付システム）
        </h1>
      </div>
    </header>
  );
}