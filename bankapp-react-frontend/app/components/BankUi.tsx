import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

type QuickActionProps = {
  number: string;
  title: string;
  detail: string;
  onClick: () => void;
  tone: string;
};

export function QuickAction({ number, title, detail, onClick }: QuickActionProps) {
  return (
    <Button variant="outline" className="h-auto min-h-28 flex-col items-start justify-between whitespace-normal p-4 text-left" onClick={onClick}>
      <span className="flex w-full items-center justify-between text-xs text-muted-foreground">
        <span className="rounded border border-border bg-muted px-2 py-1 font-medium text-foreground">{number}</span>
        <span aria-hidden="true">→</span>
      </span>
      <span><strong className="block text-sm">{title}</strong><span className="mt-1 block text-xs font-normal text-muted-foreground">{detail}</span></span>
    </Button>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string | number;
  required?: boolean;
  min?: string;
  step?: string;
};

export function Field({ label, name, type = "text", placeholder, defaultValue, required, min, step }: FieldProps) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <Input name={name} type={type} placeholder={placeholder} defaultValue={defaultValue} required={required} min={min} step={step} />
    </label>
  );
}

type EmptyStateProps = {
  title: string;
  detail: string;
  action: string;
  onClick: () => void;
};

export function EmptyState({ title, detail, action, onClick }: EmptyStateProps) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center gap-2 p-6 text-center">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{detail}</p>
      <Button variant="outline" onClick={onClick}>{action} ↗</Button>
    </div>
  );
}

type ApiRowProps = {
  method: string;
  path: string;
  description: string;
  onClick?: () => void;
};

export function ApiRow({ method, path, description, onClick }: ApiRowProps) {
  const content = <>
      <Badge variant="secondary" className="whitespace-nowrap">{method}</Badge>
      <span className="min-w-0"><span className="block truncate font-mono text-xs">{path}</span><span className="block text-xs text-muted-foreground sm:hidden">{description}</span></span>
      <span className="hidden text-sm text-muted-foreground sm:block">{description}</span>
      {onClick && <span aria-hidden="true">↗</span>}
    </>;
  const className = `grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b py-3 text-left ${onClick ? "hover:bg-muted/50" : ""}`;

  return onClick ? <button className={className} onClick={onClick}>{content}</button> : <div className={className}>{content}</div>;
}
