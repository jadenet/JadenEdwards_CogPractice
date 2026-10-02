import { useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";

const primaryLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" }
];

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-field px-3 py-2 text-sm font-medium transition-colors hover:bg-base-200 ${isActive ? "bg-base-200 text-primary" : "text-base-content/80"}`;

  useEffect(() => {
    if (mobileMenuRef.current) mobileMenuRef.current.open = false;
  }, [pathname]);

  return (
    <header className="navbar sticky top-0 z-30 min-h-16 border-b border-base-300 bg-base-100/95 px-4 backdrop-blur sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
        <Link className="flex items-center gap-2" to="/" aria-label="ABC Bank home">
          <span className="flex h-9 items-center rounded-field bg-primary px-2 text-xs font-semibold text-primary-content">
            ABC
          </span>
          <span className="font-semibold text-base-content">Bank</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {primaryLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <details ref={mobileMenuRef} className="dropdown dropdown-end md:hidden">
            <summary className="btn btn-ghost btn-sm list-none" aria-label="Open navigation menu">Menu</summary>
            <ul className="menu dropdown-content z-40 mt-3 w-52 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg" aria-label="Main navigation">
              {primaryLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end
                    className={({ isActive }) => isActive ? "bg-base-200 font-medium text-primary" : "font-medium"}
                    onClick={(event) => {
                      const menu = event.currentTarget.closest("details");
                      if (menu) menu.open = false;
                    }}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </details>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/users")}>
            Choose profile<span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
    </header>
  );
}
