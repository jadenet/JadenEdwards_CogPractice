import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="footer sm:footer-horizontal mt-10 justify-between gap-6 border-t border-base-300 py-6 text-xs text-base-content/70">
      <aside className="gap-3">
        <Link className="flex items-center gap-2 text-foreground" to="/" aria-label="ABC Bank home">
          <span className="flex h-9 items-center rounded-md bg-primary px-2 text-xs font-semibold text-primary-content">ABC</span>
          <span className="font-semibold">Bank</span>
        </Link>
        <p>Everyday banking, made simple.</p>
      </aside>
      <nav aria-label="Footer navigation">
        <h2 className="footer-title text-base-content">Explore</h2>
        {["about", "contact"].map((item) => (
          <Link key={item} to={`/${item}`} className="capitalize hover:text-foreground">{item}</Link>
        ))}
      </nav>
    </footer>
  );
}
