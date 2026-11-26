import Link from "next/link";
import { ArrowRight, Construction } from "lucide-react";

interface PagePlaceholderProps {
  title: string;
  description: string;
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <main className="container-shell section-pad">
      <div className="card-surface mx-auto max-w-3xl rounded-[2rem] px-8 py-14 text-center sm:px-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-muted text-primary">
          <Construction className="h-7 w-7" aria-hidden="true" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Coming in the next phase</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted">{description}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-deep">
            Back to Home
          </Link>
          <Link href="/discover" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-surface px-6 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary">
            Explore Recipes <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  );
}
