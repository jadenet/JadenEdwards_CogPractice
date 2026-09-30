import type { FormEvent } from "react";
import { EmptyState } from "../../components/BankUi";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import type { Account, Transaction } from "../../types/bank";

export type TransactionPageProps = {
  transactions: Transaction[];
  account: Account | null;
  onLoad: () => void;
  onShowAccount: () => void;
};

export function MoneyMovementPage({ direction, account, busy, onSubmit }: {
  direction: "deposit" | "withdraw";
  account: Account | null;
  busy: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>, direction: "deposit" | "withdraw") => void;
}) {
  const isDeposit = direction === "deposit";

  return (
    <Card className="mx-auto max-w-2xl p-5 sm:p-8">
      <p className="text-sm text-muted-foreground">{isDeposit ? "Deposit" : "Withdrawal"}</p>
      <h2 className="mt-1 text-2xl font-semibold">{isDeposit ? "Add money to your account" : "Take money out"}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{account ? `Moving money for ${account.userName} · account ending ${account.accountId.slice(-6)}.` : "Select an account before moving money."}</p>
      <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={(event) => onSubmit(event, direction)}>
        <label className="grid gap-2 text-sm font-medium sm:col-span-2">Amount<Input name="amount" type="number" min="0.01" step="0.01" placeholder="0.00" required /></label>
        <Button className="sm:col-span-2 sm:justify-self-start" disabled={busy || !account}>{busy ? "Working…" : isDeposit ? "Make deposit" : "Make withdrawal"} ↗</Button>
      </form>
      <p className="mt-4 text-xs text-muted-foreground">{isDeposit ? "Deposits are added to your available balance immediately." : "Withdrawals are limited to your available balance."}</p>
    </Card>
  );
}

export function TransactionHistoryPage({ transactions, account, onLoad, onShowAccount }: TransactionPageProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5"><div><p className="text-sm text-muted-foreground">{account ? `${account.userName} · account ending ${account.accountId.slice(-6)}` : "No account selected"}</p><span className="mt-1 block text-xs text-muted-foreground">{transactions.length} transactions</span></div><Button variant="outline" onClick={onLoad} disabled={!account}>Refresh activity ↻</Button></div>
      {transactions.length > 0 ? (
        <Table>
          <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Date</TableHead><TableHead>Account</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
          <TableBody>{transactions.map((transaction, index) => (
            <TableRow key={`${transaction.date}-${index}`}>
              <TableCell>{transaction.type === "DEPOSIT" ? "↓ Deposit" : "↑ Withdrawal"}</TableCell>
              <TableCell>{new Date(`${transaction.date}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">{account?.accountId.slice(-6) || "—"}</TableCell>
              <TableCell className={`text-right font-medium ${transaction.type === "DEPOSIT" ? "text-green-700" : "text-destructive"}`}>{transaction.type === "DEPOSIT" ? "+" : "−"}${Number(transaction.amount).toFixed(2)}</TableCell>
            </TableRow>
          ))}</TableBody>
        </Table>
      ) : <EmptyState title={account ? "No activity yet" : "Select an account"} detail={account ? "Transactions for this account will appear here." : "Open an account to view its transaction history."} action="Go to accounts" onClick={onShowAccount} />}
    </Card>
  );
}
