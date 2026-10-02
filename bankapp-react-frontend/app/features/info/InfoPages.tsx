export function AboutPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <section>
      <div className="grid gap-5 border-b border-base-300 pb-8 md:grid-cols-[1fr_1.15fr] md:gap-12 md:pb-10">
        <div>
          <p className="text-xs font-semibold uppercase text-primary">About ABC Bank</p>
          <h2 className="mt-3 max-w-lg text-3xl font-semibold leading-tight sm:text-4xl">Banking for the everyday.</h2>
        </div>
        <div className="max-w-2xl md:pt-5">
          <p className="text-base leading-7">Money is part of daily life. We believe managing it should feel clear, useful, and within reach.</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">ABC Bank brings everyday banking tasks together in one place, from choosing a profile and viewing accounts to making deposits and withdrawals.</p>
          <button className="btn btn-primary mt-5" onClick={() => onNavigate("/users")}>Explore your accounts <span aria-hidden="true">↗</span></button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[0.7fr_1.3fr] md:gap-12">
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">What guides us</p>
          <h3 className="mt-2 text-xl font-semibold">A clear approach to banking.</h3>
        </div>
        <div className="divide-y divide-base-300 border-y border-base-300">
          <article className="grid gap-2 py-5 sm:grid-cols-[1fr_1.4fr] sm:gap-8">
            <h4 className="text-sm font-semibold">Put people first</h4>
            <p className="text-sm leading-5 text-muted-foreground">Make common banking tasks easier to find and simpler to complete.</p>
          </article>
          <article className="grid gap-2 py-5 sm:grid-cols-[1fr_1.4fr] sm:gap-8">
            <h4 className="text-sm font-semibold">Keep it clear</h4>
            <p className="text-sm leading-5 text-muted-foreground">Present account information and money movement in a straightforward way.</p>
          </article>
          <article className="grid gap-2 py-5 sm:grid-cols-[1fr_1.4fr] sm:gap-8">
            <h4 className="text-sm font-semibold">Give you control</h4>
            <p className="text-sm leading-5 text-muted-foreground">Keep the tools you need close at hand, so you can manage your accounts on your terms.</p>
          </article>
        </div>
      </div>
    </section>
  );
}

export function ContactPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <section>
      <div className="grid gap-3 border-b border-base-300 pb-6 sm:grid-cols-[1fr_1.3fr] sm:gap-8 sm:pb-8">
        <div>
          <p className="text-xs font-semibold uppercase text-primary">Contact ABC Bank</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">How can we help?</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:pt-5">For questions about your accounts or help using our banking tools, get in touch by email. You can also find your profile and account information online.</p>
      </div>

      <div className="grid gap-8 pt-7 md:grid-cols-[1.3fr_0.7fr] md:gap-12 md:pt-9">
        <div>
          <h3 className="text-lg font-semibold">Email support</h3>
          <p className="mt-1 text-sm text-muted-foreground">Send us a message and our team will be in touch.</p>
          <a className="mt-4 inline-flex items-center gap-2 text-base font-semibold text-primary underline-offset-4 hover:underline" href="mailto:hello@abcbank.example">hello@abcbank.example <span aria-hidden="true">↗</span></a>
          <div className="mt-7 border-t border-base-300 pt-5">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Business hours</p>
              <p className="mt-2 text-sm">Monday–Friday, 8am–6pm</p>
              <p className="mt-1 text-sm">Saturday, 9am–1pm</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Online banking</h3>
          <p className="mt-1 text-sm text-muted-foreground">Go straight to the tools you need.</p>
          <div className="mt-4 divide-y divide-base-300 border-y border-base-300">
            <button className="group flex w-full items-center justify-between gap-4 py-4 text-left" onClick={() => onNavigate("/users")}>
              <span><strong className="block text-sm font-semibold">Profiles and accounts</strong><span className="mt-1 block text-sm text-muted-foreground">Find a profile or review account details.</span></span>
              <span className="text-lg text-primary transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
            </button>
            <button className="group flex w-full items-center justify-between gap-4 py-4 text-left" onClick={() => onNavigate("/about")}>
              <span><strong className="block text-sm font-semibold">About ABC Bank</strong><span className="mt-1 block text-sm text-muted-foreground">Learn about our approach to everyday banking.</span></span>
              <span className="text-lg text-primary transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

