"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Choice<T extends string> = {
  value: T;
  title: ReactNode;
  description?: ReactNode;
  aside?: ReactNode;
  badge?: ReactNode;
};

/** Liste à filets avec boutons radio (sélection de prestation ou de format) */
export function ChoiceList<T extends string>({
  name,
  legend,
  choices,
  value,
  onChange,
}: {
  name: string;
  legend: ReactNode;
  choices: Choice<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-8 text-h3 font-light">{legend}</legend>
      <ul className="border-t border-ink">
        {choices.map((choice) => {
          const checked = choice.value === value;
          const id = `${name}-${choice.value}`;
          return (
            <li key={choice.value} className="border-b border-line">
              <label
                htmlFor={id}
                className="group flex cursor-pointer items-start gap-5 py-6 transition-[padding] duration-500 ease-soft hover:pl-1.5 md:py-7"
              >
                <input
                  id={id}
                  type="radio"
                  name={name}
                  value={choice.value}
                  checked={checked}
                  onChange={() => onChange(choice.value)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className={cn(
                    "mt-[7px] grid size-[18px] shrink-0 place-items-center rounded-full border border-ink",
                    "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-ink",
                  )}
                >
                  <span className={cn("size-2 rounded-full bg-ink transition-transform", checked ? "scale-100" : "scale-0")} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="text-[20px] leading-snug tracking-[-0.01em] md:text-[22px]">{choice.title}</span>
                    {choice.badge && <span className="label-mono text-ink-muted">{choice.badge}</span>}
                  </span>
                  {choice.description && <span className="mt-1.5 block max-w-xl text-ink-muted">{choice.description}</span>}
                </span>
                {choice.aside && <span className="shrink-0 pt-0.5">{choice.aside}</span>}
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
