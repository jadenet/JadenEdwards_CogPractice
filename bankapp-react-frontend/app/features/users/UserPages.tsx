import type { FormEvent } from "react";
import type { User } from "../../types/bank";
import { fake, GenInput } from "../../components/FakeFields";

export type UserPageProps = {
  users: User[];
  editingUser: User | null;
  userId: string;
  busy: boolean;
  setUserId: (value: string) => void;
  onFind: () => void;
  onRefresh: () => void;
  onCreate: () => void;
  onSelect: (user: User) => void;
  onEdit: (user: User | null) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDelete: (user: User) => void;
};

export function UserListPage({ users, editingUser, userId, busy, setUserId, onFind, onRefresh, onCreate, onSelect, onEdit, onSubmit, onDelete }: UserPageProps) {
  return (
    <section className="card overflow-hidden border border-base-300 bg-base-100">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
        <div><p className="text-sm text-base-content/80">Profiles connected to ABC Bank</p><span className="mt-1 block text-xs text-muted-foreground">{users.length} {users.length === 1 ? "profile" : "profiles"}</span></div>
        <button className="btn btn-primary btn-sm sm:btn-md" onClick={onCreate}>＋ Create profile</button>
      </div>
      <form className="flex flex-col gap-2 border-y border-base-300 bg-base-200/60 p-3 sm:flex-row sm:p-4" onSubmit={(event) => { event.preventDefault(); onFind(); }}>
        <label className="input input-bordered flex w-full items-center gap-2 bg-base-100 sm:flex-1">
          <span className="text-xs text-muted-foreground">ID</span>
          <input className="grow" aria-label="Profile ID" placeholder="Paste a profile ID" value={userId} onChange={(event) => setUserId(event.target.value)} />
        </label>
        <button className="btn btn-outline" type="submit" disabled={busy}>Find profile</button>
        <button type="button" className="btn btn-ghost btn-square" onClick={onRefresh} aria-label="Refresh profiles" title="Refresh profiles" disabled={busy}>↻</button>
      </form>
      {editingUser && <UserEditForm user={editingUser} busy={busy} onSubmit={onSubmit} onDelete={() => onDelete(editingUser)} onClose={() => onEdit(null)} />}
      {users.length > 0 ? (
        <>
          <div className="divide-y divide-base-300 md:hidden">
            {users.map((user) => (
              <article className="p-4" key={user.user_id}>
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0"><h3 className="truncate font-semibold">{user.name}</h3><p className="mt-1 break-all text-sm text-muted-foreground">{user.email}</p></div>
                  <span className="badge badge-outline shrink-0">Profile</span>
                </div>
                <p className="mt-3 break-all font-mono text-xs text-muted-foreground">ID: {user.user_id}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button className="btn btn-primary btn-sm" onClick={() => onSelect(user)}>Choose profile</button>
                  <button className="btn btn-outline btn-sm" onClick={() => onEdit(user)}>Edit</button>
                </div>
              </article>
            ))}
          </div>
          <div className="hidden w-full overflow-x-auto md:block">
            <table className="table table-sm">
              <thead><tr><th>Name</th><th className="hidden lg:table-cell">Email</th><th className="hidden xl:table-cell">Profile ID</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>{users.map((user) => (
                <tr className="hover" key={user.user_id}>
                  <td className="font-medium">{user.name}</td>
                  <td className="hidden lg:table-cell">{user.email}</td>
                  <td className="hidden font-mono text-xs text-muted-foreground xl:table-cell">{user.user_id}</td>
                  <td><div className="flex justify-end gap-2"><button className="btn btn-primary btn-sm" onClick={() => onSelect(user)}>Choose profile</button><button className="btn btn-ghost btn-sm" onClick={() => onEdit(user)}>Edit</button></div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </>
      ) : <div className="flex min-h-52 flex-col items-center justify-center gap-2 p-6 text-center"><h3 className="text-base font-semibold">No profiles yet</h3><p className="max-w-sm text-sm text-muted-foreground">Create a profile to get started with ABC Bank.</p><button className="btn btn-outline" onClick={onCreate}>Create a profile</button></div>}
    </section>
  );
}

export function UserCreatePage({ busy, onSubmit }: Pick<UserPageProps, "busy" | "onSubmit">) {
  return (
    <section className="card grid overflow-hidden border border-base-300 bg-base-100 md:grid-cols-2">
      <div className="bg-secondary p-5 sm:p-6"><p className="text-sm text-muted-foreground">People first</p><h2 className="mt-2 text-2xl font-semibold">Every account starts with a person.</h2><p className="mt-2 text-sm text-muted-foreground">Add their details to create a bank profile.</p></div>
      <form className="grid content-center gap-4 p-5 sm:p-6" onSubmit={onSubmit}>
        <label className="grid gap-2 text-sm font-medium">Full name<GenInput generate={fake.name} className="input input-bordered w-full" name="name" placeholder="e.g. Alex Morgan" required /></label>
        <label className="grid gap-2 text-sm font-medium">Email address<GenInput generate={fake.email} className="input input-bordered w-full" name="email" type="email" placeholder="alex@example.com" required /></label>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <button className="btn btn-primary" disabled={busy}>{busy ? "Saving…" : "Create profile"} ↗</button>
        </div>
      </form>
    </section>
  );
}

function UserEditForm({ user, busy, onSubmit, onDelete, onClose }: { user: User; busy: boolean; onSubmit: UserPageProps["onSubmit"]; onDelete: () => void; onClose: () => void }) {
  return (
    <section className="card m-4 border border-base-300 bg-base-100 p-4"><form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
      <div className="flex items-center justify-between sm:col-span-2"><strong>Edit profile</strong><button type="button" className="btn btn-ghost btn-square btn-sm" onClick={onClose} aria-label="Close">×</button></div>
      <label className="grid gap-2 text-sm font-medium">Full name<GenInput generate={fake.name} className="input input-bordered w-full" name="name" defaultValue={user.name} required /></label><label className="grid gap-2 text-sm font-medium">Email address<GenInput generate={fake.email} className="input input-bordered w-full" name="email" type="email" defaultValue={user.email} required /></label>
      <div className="flex gap-2 sm:col-span-2"><button className="btn btn-primary" disabled={busy}>Save changes</button><button type="button" className="btn btn-error" onClick={onDelete}>Delete</button></div>
    </form></section>
  );
}
