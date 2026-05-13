import Link from "next/link";

const Logo = () => {
  return (
    <nav className="nav-bar">
      <Link href="/" className="nav-brand">
        <span className="nav-brand-hash">#</span>LoLBot
      </Link>
      <div className="nav-links">
        <Link href="/" className="nav-link">Leaderboard</Link>
      </div>
    </nav>
  );
};

export default Logo;
