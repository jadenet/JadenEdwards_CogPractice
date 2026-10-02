import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link, matchPath, useLocation } from "react-router";
import type { Account } from "../types/bank";
import Header from "./Header";
import Footer from "./Footer";

const pageTitles = [
  { path: "/", crumb: "home", title: "Your money, in good company." },
  { path: "/login", crumb: "log in", title: "Welcome back" },
  { path: "/signup", crumb: "sign up", title: "Join ABC Bank" },
  { path: "/admin", crumb: "admin", title: "Admin dashboard" },
  { path: "/users", crumb: "users", title: "People & profiles" },
  { path: "/users/new", crumb: "create user", title: "Create a user" },
  { path: "/users/:userId/accounts", crumb: "accounts", title: "Your accounts" },
  { path: "/users/:userId/accounts/new", crumb: "create account", title: "Open an account" },
  { path: "/accounts/:accountId", crumb: "account details", title: "Account details" },
  { path: "/accounts/:accountId/deposit", crumb: "deposit", title: "Add money" },
  { path: "/accounts/:accountId/withdraw", crumb: "withdraw", title: "Move money out" },
  { path: "/accounts/:accountId/transactions", crumb: "transactions", title: "Account activity" },
  { path: "/about", crumb: "about", title: "A bank for real life" },
  { path: "/contact", crumb: "contact", title: "Here when you need us" },
];

type BankShellProps = {
  account: Account | null;
  notice: string;
  error: string;
  loading: boolean;
  confirmation: { title: string; description: string; confirmLabel: string } | null;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  onDismissAlert: () => void;
  children: ReactNode;
};

export function Layout({ account, notice, error, loading, confirmation, onConfirmDelete, onCancelDelete, onDismissAlert, children }: BankShellProps) {
  const { pathname } = useLocation();
  const deleteDialogRef = useRef<HTMLDialogElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const current = pageTitles.find((item) => matchPath(item.path, pathname)) ?? { crumb: "not found", title: "Page not found" };

  useEffect(() => {
    const dialog = deleteDialogRef.current;
    if (confirmation && dialog && !dialog.open) {
      dialog.showModal();
      cancelButtonRef.current?.focus();
    } else if (!confirmation && dialog?.open) {
      dialog.close();
    }
  }, [confirmation]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
        <main className="flex min-w-0 flex-1 flex-col px-4 py-6 sm:px-6 lg:py-8">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <nav className="breadcrumbs mb-1 p-0 text-xs text-base-content/60" aria-label="Breadcrumb">
                <ul>
                  <li><Link to="/" className="hover:text-primary">ABC Bank</Link></li>
                  <li aria-current="page"><span className="capitalize">{current.crumb}</span></li>
                </ul>
              </nav>
              <h1 className="text-2xl font-semibold text-base-content sm:text-3xl">{current.title}</h1>
            </div>
          </div>

          <div className="relative mt-3 flex-1" aria-busy={loading}>
            {children}
            {loading && <div className="absolute inset-0 z-40 grid place-items-center bg-base-100/75 backdrop-blur-sm" role="status" aria-live="polite"><div className="alert w-fit border border-base-300 bg-base-100 shadow-md"><span className="loading loading-spinner text-primary" aria-hidden="true" /><span>Updating your accounts</span></div></div>}
          </div>
        </main>
        <div className="px-4 pb-6 sm:px-6"><Footer /></div>
      </div>

      {(notice || error) && <Toast key={error || notice} message={error || notice} isError={!!error} onDismiss={onDismissAlert} />}
      <dialog
        ref={deleteDialogRef}
        className="modal"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        onCancel={(event) => {
          event.preventDefault();
          onCancelDelete();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) onCancelDelete();
        }}
      >
        {confirmation && <div className="modal-box max-w-md border border-base-300">
          <span className="badge badge-error badge-outline mb-3">Destructive action</span>
          <h2 id="delete-dialog-title" className="text-lg font-semibold">{confirmation.title}</h2>
          <p id="delete-dialog-description" className="mt-2 text-sm text-base-content/70">{confirmation.description}</p>
          <div className="modal-action">
            <button ref={cancelButtonRef} className="btn btn-ghost" onClick={onCancelDelete}>Cancel</button>
            <button className="btn btn-error" onClick={onConfirmDelete}>{confirmation.confirmLabel}</button>
          </div>
        </div>}
      </dialog>
    </div>
  );
}

export function Toast({ message, isError, onDismiss }: { message: string; isError: boolean; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10);
    const hide = setTimeout(() => setVisible(false), isError ? 6000 : 4000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [isError]);

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`toast toast-end toast-bottom z-50 w-[calc(100%-2rem)] max-w-sm transition-all duration-300 ease-out ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
      onTransitionEnd={(event) => {
        if (event.target === event.currentTarget && event.propertyName === "opacity" && !visible) onDismiss();
      }}
    >
      <div className={`alert shadow-lg ${isError ? "alert-error" : "alert-success"}`}>
        <span aria-hidden="true">{isError ? "!" : "✓"}</span>
        <span className="flex-1">{message}</span>
        <button className="btn btn-ghost btn-square btn-sm -my-2" onClick={() => setVisible(false)} aria-label="Dismiss">×</button>
      </div>
    </div>
  );
}
