import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { isGuest, useAuth } from "./auth";
import {
  ActivityIcon,
  DatabaseIcon,
  FileTextIcon,
  HelpCircleIcon,
  HomeIcon,
  InfoIcon,
  LogInIcon,
  LogOutIcon,
  UserIcon,
} from "./icons";

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
      {router.pathname !== "/" && (
        <Link href="/" className={styles.homeBtn} title="Home" aria-label="Home">
          <HomeIcon size={24} />
        </Link>
      )}
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
            href="/account"
            onClick={() => setOpen(false)}
          >
            <UserIcon size={16} className={styles.optionIcon} />
            <span>My Account</span>
          </Link>
          <Link
            className={styles.dropdownItem}
            role="menuitem"
            href="/about"
            onClick={() => setOpen(false)}
          >
            <InfoIcon size={16} className={styles.optionIcon} />
            <span>About trace.moe</span>
          </Link>
          <Link
            className={styles.dropdownItem}
            role="menuitem"
            href="/database"
            onClick={() => setOpen(false)}
          >
            <DatabaseIcon size={16} className={styles.optionIcon} />
            <span>Database</span>
          </Link>
          <Link
            className={styles.dropdownItem}
            role="menuitem"
            href="/status"
            onClick={() => setOpen(false)}
          >
            <ActivityIcon size={16} className={styles.optionIcon} />
            <span>System Status</span>
          </Link>
          <div className={styles.separator}></div>
          <Link
            className={styles.dropdownItem}
            role="menuitem"
            href="/faq"
            onClick={() => setOpen(false)}
          >
            <HelpCircleIcon size={16} className={styles.optionIcon} />
            <span>Help and FAQ</span>
          </Link>
          <Link
            className={styles.dropdownItem}
            role="menuitem"
            href="/terms"
            onClick={() => setOpen(false)}
          >
            <FileTextIcon size={16} className={styles.optionIcon} />
            <span>Terms &amp; Privacy</span>
          </Link>
          <div className={styles.separator}></div>
          {status === "guest" ? (
            <Link
              className={styles.dropdownItem}
              role="menuitem"
              href={`/login?next=${encodeURIComponent(router.asPath)}`}
              onClick={() => setOpen(false)}
            >
              <LogInIcon size={16} className={styles.optionIcon} />
              <span>Login</span>
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
              <LogOutIcon size={16} className={styles.optionIcon} />
              <span>Logout</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
