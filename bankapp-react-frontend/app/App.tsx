import { useEffect } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router";
import { Layout } from "./components/Layout";
import { useBanking } from "./hooks/useBanking";
import { HomePage } from "./features/home/HomePage";
import { AccountCreatePage, AccountDetailsPage, AccountListPage } from "./features/accounts/AccountPages";
import { AboutPage, ContactPage } from "./features/info/InfoPages";
import { TransactionHistoryPage, MoneyMovementPage } from "./features/transactions/TransactionPages";
import { UserCreatePage, UserListPage } from "./features/users/UserPages";

type Banking = ReturnType<typeof useBanking>;

export default function App() {
  const banking = useBanking();
  const navigate = useNavigate();
  const openCreateUser = () => {
    banking.setEditingUser(null);
    navigate("/users/new");
  };

  return (
    <Layout
      account={banking.account}
      notice={banking.notice}
      error={banking.error}
      loading={banking.busy}
      confirmation={banking.confirmation}
      onConfirmDelete={() => void banking.confirmDelete()}
      onCancelDelete={banking.cancelDelete}
      onDismissAlert={banking.dismissAlert}
    >
      <Routes>
        <Route index element={<HomePage onCreateUser={openCreateUser} onChooseProfile={() => navigate("/users")} />} />
        <Route path="users" element={
          <UserListPage
            users={banking.users}
            editingUser={banking.editingUser}
            userId={banking.userId}
            busy={banking.busy}
            setUserId={banking.setUserId}
            onFind={() => void banking.findUser()}
            onRefresh={() => void banking.loadUsers()}
            onCreate={openCreateUser}
            onSelect={(user) => navigate(`/users/${user.user_id}/accounts`)}
            onEdit={banking.setEditingUser}
            onSubmit={banking.submitUser}
            onDelete={(user) => void banking.deleteUser(user)}
          />
        } />
        <Route path="users/new" element={<UserCreatePage busy={banking.busy} onSubmit={banking.submitUser} />} />
        <Route path="users/:userId/accounts" element={<UserAccountsRoute banking={banking} />} />
        <Route path="users/:userId/accounts/new" element={<CreateAccountRoute banking={banking} />} />
        <Route path="accounts/:accountId" element={<AccountDetailsRoute banking={banking} />} />
        <Route path="accounts/:accountId/deposit" element={<MoneyMovementRoute banking={banking} direction="deposit" />} />
        <Route path="accounts/:accountId/withdraw" element={<MoneyMovementRoute banking={banking} direction="withdraw" />} />
        <Route path="accounts/:accountId/transactions" element={<TransactionsRoute banking={banking} />} />
        <Route path="about" element={<AboutPage onNavigate={navigate} />} />
        <Route path="contact" element={<ContactPage onNavigate={navigate} />} />
        <Route path="*" element={<p className="text-sm text-muted-foreground">The requested page could not be found.</p>} />
      </Routes>
    </Layout>
  );
}

function UserAccountsRoute({ banking }: { banking: Banking }) {
  const { userId = "" } = useParams();
  const navigate = useNavigate();
  useEffect(() => { void banking.openUser(userId); }, [userId]);

  if (banking.selectedUser?.user_id !== userId) return null;
  return (
    <AccountListPage
      accounts={banking.accounts}
      user={banking.selectedUser}
      onSelect={(id) => navigate(`/accounts/${id}`)}
      onCreate={() => navigate(`/users/${userId}/accounts/new`)}
    />
  );
}

function CreateAccountRoute({ banking }: { banking: Banking }) {
  const { userId = "" } = useParams();
  useEffect(() => { void banking.openUser(userId); }, [userId]);

  if (banking.selectedUser?.user_id !== userId) return null;
  return <AccountCreatePage user={banking.selectedUser} busy={banking.busy} onSubmit={banking.submitAccount} />;
}

function AccountDetailsRoute({ banking }: { banking: Banking }) {
  const { accountId = "" } = useParams();
  const navigate = useNavigate();
  useEffect(() => { void banking.openAccount(accountId); }, [accountId]);

  const account = banking.account;
  if (account?.accountId !== accountId) return null;
  return (
    <AccountDetailsPage
      account={account}
      busy={banking.busy}
      editingAccount={banking.editingAccount}
      setEditingAccount={banking.setEditingAccount}
      onSave={banking.saveAccount}
      onDelete={() => void banking.deleteAccount()}
      onBack={() => navigate(`/users/${account.userId}/accounts`)}
      onDeposit={() => navigate(`/accounts/${accountId}/deposit`)}
      onWithdraw={() => navigate(`/accounts/${accountId}/withdraw`)}
      onTransactions={() => navigate(`/accounts/${accountId}/transactions`)}
    />
  );
}

function MoneyMovementRoute({ banking, direction }: { banking: Banking; direction: "deposit" | "withdraw" }) {
  const { accountId = "" } = useParams();
  const navigate = useNavigate();
  useEffect(() => { void banking.openAccount(accountId); }, [accountId]);

  const account = banking.account?.accountId === accountId ? banking.account : null;
  return <MoneyMovementPage direction={direction} account={account} busy={banking.busy} onSubmit={banking.moveMoney} onShowAccount={() => navigate(`/accounts/${accountId}`)} />;
}

function TransactionsRoute({ banking }: { banking: Banking }) {
  const { accountId = "" } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    void banking.openAccount(accountId);
    void banking.loadTransactions(accountId);
  }, [accountId]);

  const account = banking.account?.accountId === accountId ? banking.account : null;
  return (
    <TransactionHistoryPage
      transactions={banking.transactions}
      account={account}
      onLoad={() => void banking.loadTransactions(accountId)}
      onShowAccount={() => navigate(`/accounts/${accountId}`)}
    />
  );
}
