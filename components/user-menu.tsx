import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { isGuest, useAuth } from "./auth";

import styles from "./user-menu.module.css";

export default function UserMenu() {
  const { status, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        avatarRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (status === "loading") return <div className={styles.userMenu}></div>;

  return (
    <div className={styles.userMenu} ref={containerRef}>
      <button
        className={styles.avatar}
        ref={avatarRef}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen(!open)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="32"
          height="32"
          className="menu-icon"
          aria-hidden="true"
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>
      {open && (
        <div className={styles.dropdown} role="menu">
          <div className={styles.dropdownEmail}>{isGuest(user?.id || "") ? "Guest" : user.id}</div>
          <Link
            className={styles.dropdownItem}
            role="menuitem"
            href="/"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            className={styles.dropdownItem}
            role="menuitem"
            href="/account"
            onClick={() => setOpen(false)}
          >
            My Account
          </Link>
          <Link
            className={styles.dropdownItem}
            role="menuitem"
            href="/about"
            onClick={() => setOpen(false)}
          >
            About
          </Link>
          <div className={styles.separator}></div>
          <Link
            className={styles.dropdownItem}
            role="menuitem"
            href="/faq"
            onClick={() => setOpen(false)}
          >
            Help and FAQ
          </Link>
          <Link
            className={styles.dropdownItem}
            role="menuitem"
            href="/terms"
            onClick={() => setOpen(false)}
          >
            Terms &amp; Privacy
          </Link>
          <div className={styles.separator}></div>
          {status === "guest" ? (
            <Link
              className={styles.dropdownItem}
              role="menuitem"
              href={`/login?next=${encodeURIComponent(router.asPath)}`}
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          ) : (
            <button
              className={styles.dropdownItem}
              role="menuitem"
              onClick={() => {
                setOpen(false);
                logout();
              }}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </div>
  );
}
