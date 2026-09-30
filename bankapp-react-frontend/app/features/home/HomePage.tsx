import { QuickAction } from "../../components/BankUi";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";

export type HomePageProps = {
  userCount: number;
  onCreateUser: () => void;
  onChooseProfile: () => void;
};

export function HomePage({ userCount, onCreateUser, onChooseProfile }: HomePageProps) {
  return (
    <>
      <section className="rounded-lg border bg-card p-6 sm:p-8">
        <p className="text-sm text-muted-foreground">Banking overview</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Simple tools for everyday banking.</h2>
        <p className="mt-2 text-sm text-muted-foreground">Choose your profile to see the accounts connected to it.</p>
        <Button variant="default" className="mt-5" onClick={onChooseProfile}>Choose a profile <span>↗</span></Button>
      </section>

      <section className="mt-8">
        <div className="mb-4"><p className="text-sm text-muted-foreground">Start with the basics</p><h2 className="text-lg font-semibold">What would you like to do?</h2></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <QuickAction number="01" title="Sign in to a profile" detail="Choose from your existing profiles" onClick={onChooseProfile} tone="blue" />
          <QuickAction number="02" title="Create a profile" detail="Set up a new user" onClick={onCreateUser} tone="coral" />
        </div>
      </section>

      <section className="mt-4">
        <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div><p className="text-sm text-muted-foreground">Profiles at ABC Bank</p><strong className="text-3xl font-semibold">{userCount.toString().padStart(2, "0")}</strong><span className="ml-2 text-sm text-muted-foreground">available to choose</span></div>
          <Button variant="outline" onClick={onChooseProfile}>View profiles ↗</Button>
        </Card>
      </section>
    </>
  );
}
