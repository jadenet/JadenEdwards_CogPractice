import type { FormEvent } from "react";
import { EmptyState, Field } from "../../components/BankUi";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import type { User } from "../../types/bank";

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
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div><p className="text-sm text-muted-foreground">Keep the people who bank with you organized.</p><span className="mt-1 block text-xs text-muted-foreground">{users.length} {users.length === 1 ? "profile" : "profiles"}</span></div>
        <Button onClick={onCreate}>＋ Add user</Button>
      </div>
      <div className="flex flex-col gap-2 border-y bg-muted/30 p-4 sm:flex-row">
        <Input aria-label="User ID" placeholder="Paste a user ID" value={userId} onChange={(event) => setUserId(event.target.value)} />
        <Button variant="outline" onClick={onFind}>Find user ↗</Button>
        <Button variant="ghost" size="icon" onClick={onRefresh} aria-label="Refresh users">↻</Button>
      </div>
      {editingUser && <UserEditForm user={editingUser} busy={busy} onSubmit={onSubmit} onDelete={() => onDelete(editingUser)} onClose={() => onEdit(null)} />}
      {users.length > 0 ? (
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>User ID</TableHead><TableHead>Profile</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader>
          <TableBody>{users.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell><TableCell className="font-mono text-xs text-muted-foreground">{user.user_id}</TableCell>
              <TableCell><Button variant="outline" size="sm" onClick={() => onSelect(user)}>Choose profile ↗</Button></TableCell>
              <TableCell><Button variant="ghost" size="sm" onClick={() => onEdit(user)}>Edit ↗</Button></TableCell>
            </TableRow>
          ))}</TableBody>
        </Table>
      ) : <EmptyState title="No users yet" detail="Create a profile to get started with ABC Bank." action="Create a user" onClick={onCreate} />}
    </Card>
  );
}

export function UserCreatePage({ busy, onSubmit }: Pick<UserPageProps, "busy" | "onSubmit">) {
  return (
    <Card className="grid overflow-hidden md:grid-cols-2">
      <div className="bg-secondary p-6 md:p-8"><p className="text-sm text-muted-foreground">People first</p><h2 className="mt-2 text-2xl font-semibold">Every account starts with a person.</h2><p className="mt-2 text-sm text-muted-foreground">Add their details to create a bank profile.</p></div>
      <form className="grid content-center gap-4 p-6 md:p-8" onSubmit={onSubmit}>
        <Field label="Full name" name="name" placeholder="e.g. Alex Morgan" required />
        <Field label="Email address" name="email" type="email" placeholder="alex@example.com" required />
        <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-muted-foreground">Details stay attached to their profile.</span><Button disabled={busy}>{busy ? "Saving…" : "Create profile"} ↗</Button></div>
      </form>
    </Card>
  );
}

function UserEditForm({ user, busy, onSubmit, onDelete, onClose }: { user: User; busy: boolean; onSubmit: UserPageProps["onSubmit"]; onDelete: () => void; onClose: () => void }) {
  return (
    <Card className="m-4 p-4"><form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
      <div className="flex items-center justify-between sm:col-span-2"><strong>Edit profile</strong><Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close">×</Button></div>
      <Field label="Full name" name="name" defaultValue={user.name} required /><Field label="Email address" name="email" type="email" defaultValue={user.email} required />
      <div className="flex gap-2 sm:col-span-2"><Button disabled={busy}>Save changes</Button><Button type="button" variant="destructive" onClick={onDelete}>Delete</Button></div>
    </form></Card>
  );
}
