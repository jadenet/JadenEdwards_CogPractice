import Hero from "~/components/Hero";

export type HomePageProps = {
  onCreateUser: () => void;
  onChooseProfile: () => void;
};

export function HomePage({ onCreateUser, onChooseProfile }: HomePageProps) {
  return (
    <>
      <Hero onChooseProfile={onChooseProfile} />
      <section className="mt-9">
        <div className="mb-4"><p className="text-sm text-muted-foreground">Start with the basics</p><h2 className="text-lg font-semibold">What would you like to do?</h2></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <button className="btn btn-ghost h-auto min-h-28 flex-col items-start justify-between border border-base-300 p-4 text-left font-normal hover:bg-base-200" onClick={onChooseProfile}>
            <span className="flex w-full items-center justify-between text-xs text-muted-foreground"><span className="badge badge-outline">01</span><span aria-hidden="true">→</span></span>
            <span><strong className="block text-sm">Choose a profile</strong><span className="mt-1 block text-xs font-normal text-muted-foreground">View accounts linked to an existing profile</span></span>
          </button>
          <button className="btn btn-ghost h-auto min-h-28 flex-col items-start justify-between border border-base-300 p-4 text-left font-normal hover:bg-base-200" onClick={onCreateUser}>
            <span className="flex w-full items-center justify-between text-xs text-muted-foreground"><span className="badge badge-outline">02</span><span aria-hidden="true">→</span></span>
            <span><strong className="block text-sm">Create a profile</strong><span className="mt-1 block text-xs font-normal text-muted-foreground">Get started with a new banking profile</span></span>
          </button>
        </div>
      </section>
    </>
  );
}
