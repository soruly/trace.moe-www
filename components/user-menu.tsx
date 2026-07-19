import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { initials, useAuth } from "./auth";

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

  if (status === "guest") {
    if (router.pathname === "/login") return null;
    return (
      <div className={styles.userMenu}>
        <Link className={styles.loginBtn} href={`/login?next=${encodeURIComponent(router.asPath)}`}>
          Login
        </Link>
      </div>
    );
  }

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
        {initials(user.id)}
      </button>
      {open && (
        <div className={styles.dropdown} role="menu">
          <div className={styles.dropdownEmail}>{user.id}</div>
          <Link
            className={styles.dropdownItem}
            role="menuitem"
            href="/account"
            onClick={() => setOpen(false)}
          >
            Account
          </Link>
          <div className={styles.separator}></div>
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
        </div>
      )}
    </div>
  );
}
