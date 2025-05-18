
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="bg-manga-primary text-white">
      <div className="container mx-auto py-4">
        {/* サイト全体のタイトルを変更 */}
        <h1 className="text-xl font-bold">
          <Link to="/" className="hover:underline">
            UKSSS-01（宇宙兄弟サンプル送付システム）
          </Link>
        </h1>
      </div>
    </header>
  );
}
