"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Fair = {
  id: string;
  slug: string;
  title: { es: string; en?: string; ar?: string } | string;
  startDate: string | Date;
  endDate: string | Date;
  city: string;
  country: string;
};

export function FairsCalendarView({ fairs }: { fairs: Fair[] }) {
  const [cursor, setCursor] = useState<Date>(new Date());
  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = useMemo(() => eachDayOfInterval({ start: gridStart, end: gridEnd }), [gridStart, gridEnd]);

  const fairsByDay = useMemo(() => {
    const map = new Map<string, Fair[]>();
    for (const fair of fairs) {
      const start = new Date(fair.startDate);
      const end = new Date(fair.endDate);
      const range = eachDayOfInterval({ start, end });
      for (const d of range) {
        const key = format(d, "yyyy-MM-dd");
        const list = map.get(key) ?? [];
        list.push(fair);
        map.set(key, list);
      }
    }
    return map;
  }, [fairs]);

  const weekdays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  return (
    <div className="card-velvet p-6">
      <header className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => setCursor((c) => subMonths(c, 1))}
          aria-label="Mes anterior"
          className="p-2 rounded-full border border-[oklch(0.55_0.10_70_/_0.3)] text-[var(--color-ink-muted)] hover:text-[var(--color-gold)]"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h2 className="display text-2xl capitalize">
          {format(cursor, "MMMM yyyy", { locale: es })}
        </h2>
        <button
          type="button"
          onClick={() => setCursor((c) => addMonths(c, 1))}
          aria-label="Mes siguiente"
          className="p-2 rounded-full border border-[oklch(0.55_0.10_70_/_0.3)] text-[var(--color-ink-muted)] hover:text-[var(--color-gold)]"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </header>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {weekdays.map((d) => (
          <div key={d} className="accent text-[0.6rem] text-[var(--color-ink-subtle)] py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1" role="grid">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayFairs = fairsByDay.get(key) ?? [];
          const inMonth = isSameMonth(day, cursor);
          const today = isSameDay(day, new Date());
          return (
            <div
              key={key}
              role="gridcell"
              className={cn(
                "min-h-20 p-2 rounded-md border text-left",
                inMonth ? "border-[oklch(0.55_0.10_70_/_0.15)] bg-[oklch(0.18_0.020_55)]" : "border-transparent opacity-40",
                today && "ring-1 ring-[var(--color-gold)]",
              )}
            >
              <div
                className={cn(
                  "text-xs font-medium mb-1.5",
                  today ? "text-[var(--color-gold)]" : "text-[var(--color-ink-muted)]",
                )}
              >
                {format(day, "d")}
              </div>
              <ul className="space-y-1">
                {dayFairs.slice(0, 2).map((f) => {
                  const title =
                    typeof f.title === "string"
                      ? f.title
                      : f.title.es ?? f.slug;
                  return (
                    <li key={`${f.id}-${key}`}>
                      <Link
                        href={`/ferias/${f.slug}`}
                        className="block text-[0.65rem] leading-tight rounded px-1.5 py-0.5 truncate bg-[oklch(0.78_0.13_82_/_0.15)] text-[var(--color-gold)] hover:bg-[oklch(0.78_0.13_82_/_0.25)]"
                        title={title}
                      >
                        {title}
                      </Link>
                    </li>
                  );
                })}
                {dayFairs.length > 2 && (
                  <li className="text-[0.6rem] text-[var(--color-ink-subtle)]">+{dayFairs.length - 2}</li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
