import { useRef } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import type { Faker } from "@faker-js/faker";

type Generator = (faker: Faker) => string | number;

export const fake = {
  name: (f: Faker) => f.person.fullName(),
  email: (f: Faker) => f.internet.email().toLowerCase(),
  username: (f: Faker) => f.internet.username().replace(/[^a-zA-Z0-9_.-]/g, "").slice(0, 26) + f.string.numeric(4),
  password: (f: Faker) => f.internet.password({ length: 12 }),
  accountType: (f: Faker) => f.helpers.arrayElement(["Everyday", "Savings", "Checking", "Business", "Joint", "Holiday"]),
  amount: (f: Faker) => f.finance.amount({ min: 1, max: 500, dec: 2 }),
  balance: (f: Faker) => f.finance.amount({ min: 0, max: 5000, dec: 2 }),
} satisfies Record<string, Generator>;

// Faker is loaded on demand so it never lands in the main bundle.
const loadFaker = () => import("@faker-js/faker").then((module) => module.faker);

function GenerateButton({ label, onGenerate }: { label: string; onGenerate: () => void }) {
  return (
    <button type="button" className="btn join-item border-base-300" onClick={onGenerate} title={`Generate fake ${label}`} aria-label={`Generate fake ${label}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
        <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72" />
        <path d="m14 7 3 3" /><path d="M5 6v4" /><path d="M19 14v4" /><path d="M10 2v2" /><path d="M7 8H3" /><path d="M21 16h-4" /><path d="M11 3H9" />
      </svg>
    </button>
  );
}

export function GenInput({ generate, className = "", ...props }: InputHTMLAttributes<HTMLInputElement> & { generate: Generator }) {
  const ref = useRef<HTMLInputElement>(null);

  async function onGenerate() {
    const faker = await loadFaker();
    if (ref.current) ref.current.value = String(generate(faker));
  }

  return (
    <div className="join w-full">
      <input ref={ref} className={`${className} join-item`} {...props} />
      <GenerateButton label={props.name ?? "value"} onGenerate={() => void onGenerate()} />
    </div>
  );
}

export function GenSelect({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  const ref = useRef<HTMLSelectElement>(null);

  async function onGenerate() {
    const faker = await loadFaker();
    const options = Array.from(ref.current?.options ?? []).filter((option) => !option.disabled && option.value);
    if (ref.current && options.length) ref.current.value = faker.helpers.arrayElement(options).value;
  }

  return (
    <div className="join w-full">
      <select ref={ref} className={`${className} join-item`} {...props} />
      <GenerateButton label={props.name ?? "option"} onGenerate={() => void onGenerate()} />
    </div>
  );
}
