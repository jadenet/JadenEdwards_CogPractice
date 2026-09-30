import type { Route } from "./+types/home";
import { BankShell } from "../components/BankShell";
import { useBanking } from "../hooks/useBanking";
import { HomePage } from "../features/home/HomePage";
import { AccountCreatePage, AccountDetailsPage, AccountListPage } from "../features/accounts/AccountPages";
import { AboutPage, ContactPage, DataPage } from "../features/info/InfoPages";
import { TransactionHistoryPage, MoneyMovementPage } from "../features/transactions/TransactionPages";
import { UserCreatePage, UserListPage } from "../features/users/UserPages";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ABC Bank | Banking made easy" },
    { name: "description", content: "Manage your ABC Bank users, accounts, and transactions." },
  ];
}

export default function Home() {
  const banking = useBanking();
  const openCreateUser = () => {
    banking.setEditingUser(null);
    banking.setPage("create-user");
  };

  return (
    <BankShell
      page={banking.page}
      account={banking.account}
      notice={banking.notice}
      error={banking.error}
      onNavigate={banking.setPage}
      onDismissAlert={banking.dismissAlert}
    >
      {banking.page === "home" && (
        <HomePage
          userCount={banking.users.length}
          onCreateUser={openCreateUser}
          onChooseProfile={() => banking.setPage("users")}
        />
      )}

      {banking.page === "users" && (
        <UserListPage
          users={banking.users}
          editingUser={banking.editingUser}
          userId={banking.userId}
          busy={banking.busy}
          setUserId={banking.setUserId}
          onFind={() => void banking.findUser()}
          onRefresh={() => void banking.loadUsers()}
          onCreate={openCreateUser}
          onSelect={(user) => void banking.selectUser(user)}
          onEdit={banking.setEditingUser}
          onSubmit={banking.submitUser}
          onDelete={(user) => void banking.deleteUser(user)}
        />
      )}

      {banking.page === "create-user" && <UserCreatePage busy={banking.busy} onSubmit={banking.submitUser} />}

      {banking.page === "accounts" && banking.selectedUser && (
        <AccountListPage
          accounts={banking.accounts}
          user={banking.selectedUser}
          onSelect={(id) => void banking.selectAccount(id)}
          onCreate={() => banking.setPage("create-account")}
        />
      )}

      {banking.page === "create-account" && banking.selectedUser && (
        <AccountCreatePage user={banking.selectedUser} busy={banking.busy} onSubmit={banking.submitAccount} />
      )}

      {banking.page === "account-details" && banking.account && (
        <AccountDetailsPage
          account={banking.account}
          busy={banking.busy}
          editingAccount={banking.editingAccount}
          setEditingAccount={banking.setEditingAccount}
          onSave={banking.saveAccount}
          onDelete={() => void banking.deleteAccount()}
          onDeposit={() => banking.setPage("deposit")}
          onWithdraw={() => banking.setPage("withdraw")}
          onTransactions={() => void banking.loadTransactions()}
        />
      )}

      {(banking.page === "deposit" || banking.page === "withdraw") && (
        <MoneyMovementPage
          direction={banking.page}
          account={banking.account}
          busy={banking.busy}
          onSubmit={banking.moveMoney}
        />
      )}

      {banking.page === "transactions" && (
        <TransactionHistoryPage
          transactions={banking.transactions}
          account={banking.account}
          onLoad={() => void banking.loadTransactions()}
          onShowAccount={() => banking.setPage("accounts")}
        />
      )}

      {banking.page === "about" && <AboutPage onNavigate={banking.setPage} />}
      {banking.page === "contact" && <ContactPage onNavigate={banking.setPage} />}
      {banking.page === "data" && <DataPage onNavigate={banking.setPage} onTestConnection={() => void banking.loadUsers()} />}
    </BankShell>
  );
}
