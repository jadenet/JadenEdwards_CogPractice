import type { FormEvent } from "react";
import type { Account, Transaction } from "../../types/bank";
import { fake, GenInput } from "../../components/FakeFields";

export type TransactionPageProps = {
  transactions: Transaction[];
  account: Account | null;
  onLoad: () => void;
  onShowAccount: () => void;
};

function formatTransactionDate(date: string) {
  return new Date(date).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

function formatAmount(amount: number) {
  return Number(amount).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function MoneyMovementPage({ direction, account, busy, onSubmit, onShowAccount }: {
  direction: "deposit" | "withdraw";
  account: Account | null;
  busy: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>, direction: "deposit" | "withdraw") => void;
  onShowAccount: () => void;
}) {
  const isDeposit = direction === "deposit";

  return (
    <div className="mx-auto max-w-2xl">
      <button className="btn btn-ghost btn-sm mb-3" onClick={onShowAccount}>← Back to account</button>
      <section className="card border border-base-300 bg-base-100 p-4 sm:p-5">
        <p className="text-sm text-muted-foreground">{isDeposit ? "Deposit" : "Withdrawal"}</p>
        <h2 className="mt-1 text-2xl font-semibold">{isDeposit ? "Add money to your account" : "Take money out"}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{account ? `Moving money for ${account.userName} · account ending ${account.accountId.slice(-6)}.` : "Select an account before moving money."}</p>
        <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={(event) => onSubmit(event, direction)}>
          <label className="grid gap-2 text-sm font-medium sm:col-span-2">Amount<GenInput generate={fake.amount} className="input input-bordered w-full" name="amount" type="number" min="0.01" step="0.01" placeholder="0.00" required /></label>
          <button className="btn btn-primary sm:col-span-2 sm:justify-self-start" disabled={busy || !account}>{busy ? "Working…" : isDeposit ? "Make deposit" : "Make withdrawal"} ↗</button>
        </form>
        <p className="mt-4 text-xs text-muted-foreground">{isDeposit ? "Deposits are added to your available balance immediately." : "Withdrawals are limited to your available balance."}</p>
      </section>
    </div>
  );
}

export function TransactionHistoryPage({ transactions, account, onLoad, onShowAccount }: TransactionPageProps) {
  const transactionBalances = new Array<number>(transactions.length);
  let balanceInCents = Math.round((account?.balance ?? 0) * 100);

  for (let index = transactions.length - 1; index >= 0; index -= 1) {
    transactionBalances[index] = balanceInCents / 100;
    const amountInCents = Math.round(transactions[index].amount * 100);
    balanceInCents -= transactions[index].type === "DEPOSIT" ? amountInCents : -amountInCents;
  }

  return (
    <section className="card overflow-hidden border border-base-300 bg-base-100">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-base-300 p-4 sm:p-5">
        <div>
          <p className="text-sm text-muted-foreground">{account ? `${account.userName} · account ending ${account.accountId.slice(-6)}` : "No account selected"}</p>
          <span className="mt-1 block text-xs text-muted-foreground">{transactions.length} transactions</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-ghost" onClick={onShowAccount}>← Back to account</button>
          <button className="btn btn-outline" onClick={onLoad} disabled={!account}>Refresh activity ↻</button>
        </div>
      </div>
      {transactions.length > 0 ? (
        <>
          <div className="divide-y divide-base-300 px-4 md:hidden">
            {transactions.map((transaction, index) => {
              const isDeposit = transaction.type === "DEPOSIT";
              return (
                <article className="flex items-center justify-between gap-4 py-4" key={`${transaction.date}-${index}`}>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><span className={`badge ${isDeposit ? "badge-success" : "badge-error"}`}>{isDeposit ? "Deposit" : "Withdrawal"}</span><time dateTime={transaction.date} className="text-xs text-muted-foreground">{formatTransactionDate(transaction.date)}</time></div>
                    <p className="mt-1 text-xs text-muted-foreground">Balance {account ? formatAmount(transactionBalances[index]) : "—"}</p>
                  </div>
                  <p className={`shrink-0 text-sm font-semibold ${isDeposit ? "text-success" : "text-error"}`}>{isDeposit ? "+" : "−"}{formatAmount(transaction.amount)}</p>
                </article>
              );
            })}
          </div>
          <div className="hidden w-full overflow-x-auto md:block">
            <table className="table table-sm">
              <thead><tr><th>Type</th><th>Date</th><th className="text-right">Amount</th><th className="text-right">Balance</th></tr></thead>
              <tbody>{transactions.map((transaction, index) => {
                const isDeposit = transaction.type === "DEPOSIT";
                return (
                  <tr className="hover" key={`${transaction.date}-${index}`}>
                    <td><span className={`badge ${isDeposit ? "badge-success" : "badge-error"}`}>{isDeposit ? "Deposit" : "Withdrawal"}</span></td>
                    <td><time dateTime={transaction.date}>{formatTransactionDate(transaction.date)}</time></td>
                    <td className={`text-right font-semibold ${isDeposit ? "text-success" : "text-error"}`}>{isDeposit ? "+" : "−"}{formatAmount(transaction.amount)}</td>
                    <td className="text-right font-medium">{account ? formatAmount(transactionBalances[index]) : "—"}</td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        </>
      ) : <div className="flex min-h-52 flex-col items-center justify-center gap-2 p-6 text-center"><h3 className="text-base font-semibold">{account ? "No activity yet" : "Select an account"}</h3><p className="max-w-sm text-sm text-muted-foreground">{account ? "Transactions for this account will appear here." : "Open an account to view its transaction history."}</p></div>}
    </section>
  );
}
