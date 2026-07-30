"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import MonoLabel from "@/components/ui/MonoLabel";
import { PALETTE_EVENT } from "@/lib/palette";
import { play, subscribe as soundSubscribe, toggle as soundToggle } from "@/lib/sound";

/**
 * The machine's own console. Cmd/Ctrl-K anywhere, or the ⌘K plate in the nav
 * and the dock — every section, all eleven builds and the direct channels,
 * one keystroke deep.
 *
 * On a phone it is a sheet rather than a dialog: the field sits at the top
 * under the thumb's reach, the list scrolls, and the same entries are there.
 * A palette that only answers to a keyboard would be half a feature.
 *
 * Opened by the `ab:palette` event so any trigger can raise it without
 * threading state through the tree. Escape closes, arrows walk, Enter runs;
 * focus is trapped while open and handed back to whatever raised it.
 */
const SECTIONS = [
  ["Work", "#work", "The auditorium — 11 live builds"],
  ["About", "#about", "Two years, eleven industries"],
  ["Capabilities", "#capabilities", "What the work runs on"],
  ["Services", "#services", "What I do"],
  ["Process", "#process", "The same four steps"],
  ["FAQ", "#faq", "Straight answers"],
  ["Contact", "#contact", "Replies within 24 hours"],
];

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [sound, setSound] = useState(false);
  // the sheet's field is ~290px wide on a phone; the long prompt clipped mid
  // word, and a truncated instruction reads as a bug
  const [placeholder, setPlaceholder] = useState("Search the site");
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const panelRef = useRef(null);
  const restoreRef = useRef(null);

  useEffect(() => soundSubscribe(setSound), []);

  const items = useMemo(() => {
    const go = (hash) => () => {
      const el = document.querySelector(hash);
      if (!el) {
        router.push(`/${hash}`);
        return;
      }
      if (window.__lenis) window.__lenis.scrollTo(el);
      else el.scrollIntoView({ behavior: "smooth" });
    };

    return [
      ...SECTIONS.map(([label, hash, hint]) => ({
        group: "GO TO",
        label,
        hint,
        key: `s:${hash}`,
        run: go(hash),
      })),
      ...projects.map((p, i) => ({
        group: "BUILDS",
        label: p.client,
        hint: `${String(i + 1).padStart(2, "0")} · ${p.sector} · ${p.year}`,
        key: `p:${p.slug}`,
        run: () => router.push(`/work/${p.slug}`),
      })),
      {
        group: "DIRECT",
        label: "Email Amartya",
        hint: profile.contact.email,
        key: "a:mail",
        run: () => {
          window.location.href = `mailto:${profile.contact.email}`;
        },
      },
      {
        group: "DIRECT",
        label: "WhatsApp",
        hint: profile.contact.whatsapp,
        key: "a:wa",
        run: () =>
          window.open(
            `https://wa.me/${profile.contact.whatsappIntl.replace("+", "")}`,
            "_blank",
            "noopener,noreferrer"
          ),
      },
      {
        group: "DIRECT",
        label: "Copy email address",
        hint: "to the clipboard",
        key: "a:copy",
        run: () => navigator.clipboard?.writeText(profile.contact.email),
      },
      {
        group: "DIRECT",
        label: "Back to the top",
        hint: "start of the page",
        key: "a:top",
        run: () => {
          if (window.__lenis) window.__lenis.scrollTo(0);
          else window.scrollTo({ top: 0, behavior: "smooth" });
        },
      },
      {
        group: "SETTINGS",
        // the phone's only route to the switch: the dock has no room for it
        label: sound ? "Turn sound off" : "Turn sound on",
        hint: sound ? "currently on" : "off by default",
        key: "a:sound",
        keepOpen: true,
        run: soundToggle,
      },
    ];
  }, [router, sound]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) =>
      `${it.label} ${it.hint} ${it.group}`.toLowerCase().includes(q)
    );
  }, [items, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCursor(0);
    window.__lenis?.start();
    play("close");
    restoreRef.current?.focus?.();
  }, []);

  const run = useCallback(
    (item) => {
      if (!item) return;
      // the sound switch is the one row you stay in the sheet to hear
      if (item.keepOpen) {
        item.run();
        return;
      }
      close();
      // let the overlay come down before the page moves under it
      requestAnimationFrame(() => item.run());
    },
    [close]
  );

  /* ---------------------------------------- raising it */
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        restoreRef.current = document.activeElement;
        setOpen((v) => !v);
      }
    };
    const onRaise = () => {
      restoreRef.current = document.activeElement;
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(PALETTE_EVENT, onRaise);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(PALETTE_EVENT, onRaise);
    };
  }, []);

  /* ---------------------------------------- while it is up */
  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    play("open");
    setPlaceholder(
      window.matchMedia("(min-width: 640px)").matches
        ? "Jump to a section, a build, or a way to reach me"
        : "Search the site"
    );
    const t = setTimeout(() => inputRef.current?.focus(), 40);
    return () => {
      clearTimeout(t);
      window.__lenis?.start();
    };
  }, [open]);

  useEffect(() => {
    setCursor((c) => Math.min(c, Math.max(results.length - 1, 0)));
  }, [results.length]);

  // keep the highlighted row in view as the arrows walk past the fold
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector(`[data-row="${cursor}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [cursor, open]);

  if (!open) return null;

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      play("move");
      setCursor((c) => (results.length ? (c + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      play("move");
      setCursor((c) => (results.length ? (c - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[cursor]);
    } else if (e.key === "Tab") {
      // focus stays inside while it is up, but it still cycles: trapping by
      // swallowing Tab outright leaves a keyboard user with no way to reach
      // the close button
      const focusables = panelRef.current?.querySelectorAll(
        'input,button:not([tabindex="-1"])'
      );
      if (!focusables?.length) return;
      const list = [...focusables];
      const i = list.indexOf(document.activeElement);
      const next = e.shiftKey ? i - 1 : i + 1;
      if (next < 0 || next >= list.length || i === -1) {
        e.preventDefault();
        list[e.shiftKey ? list.length - 1 : 0].focus();
      }
    }
  };

  let lastGroup = null;

  return (
    <div
      className="fixed inset-0 z-[160] flex items-end justify-center p-0 sm:items-start sm:p-6 sm:pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onKeyDown={onKeyDown}
    >
      {/* the veil closes on a tap, but it is not the accessible control —
          that is the ✕/ESC button in the field row */}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={close}
        className="absolute inset-0 cursor-default bg-[rgba(10,13,11,0.72)] backdrop-blur-sm motion-safe:animate-[palette-veil_.2s_ease-out_both]"
      />

      <div
        ref={panelRef}
        className="relative flex max-h-[86vh] w-full flex-col overflow-hidden rounded-t-2xl border border-white/15 bg-[rgba(28,34,30,0.94)] backdrop-blur-xl motion-safe:animate-[palette-in_.32s_cubic-bezier(.16,1,.3,1)_both] sm:max-h-[70vh] sm:max-w-[560px] sm:rounded-2xl"
        style={{
          boxShadow: "0 40px 80px -30px rgba(0,0,0,0.9), inset 1px 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        {/* a sheet needs a handle to read as dismissable; a dialog needs a
            mark. Each screen gets the one it understands. */}
        <div className="flex justify-center pt-2.5 sm:hidden">
          <span aria-hidden="true" className="h-1 w-9 rounded-full bg-white/25" />
        </div>
        <span
          aria-hidden="true"
          className="absolute left-5 top-0 hidden h-[3px] w-8 bg-signal sm:block"
        />

        <div className="flex items-center gap-3 border-b border-rule-inv px-5 py-4">
          <span aria-hidden="true" className="font-mono text-mono tracking-mono text-signal">
            &gt;
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            placeholder={placeholder}
            aria-label="Search"
            className="min-w-0 flex-1 bg-transparent font-mono text-[0.82rem] uppercase tracking-[0.06em] text-chalk placeholder:normal-case placeholder:tracking-normal placeholder:text-chalk-mute focus:outline-none"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="-mr-1 shrink-0 rounded-full px-2 py-1 font-mono text-mono uppercase tracking-mono text-chalk-mute transition-colors hover:text-chalk"
          >
            <span className="hidden sm:inline">ESC</span>
            <span aria-hidden="true" className="text-base leading-none sm:hidden">
              ✕
            </span>
          </button>
        </div>

        <div
          ref={listRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:pb-2"
        >
          {results.length === 0 ? (
            <p className="px-5 py-8 text-center text-small text-chalk-mute">
              Nothing matches that.
            </p>
          ) : (
            results.map((item, i) => {
              const head = item.group !== lastGroup ? item.group : null;
              lastGroup = item.group;
              return (
                <div key={item.key}>
                  {head ? (
                    <MonoLabel className="px-5 pb-2 pt-4 text-chalk-mute">{head}</MonoLabel>
                  ) : null}
                  <button
                    type="button"
                    data-row={i}
                    onMouseMove={() => setCursor(i)}
                    onClick={() => run(item)}
                    aria-current={i === cursor ? "true" : undefined}
                    className={`flex w-full items-center gap-4 px-5 py-3 text-left transition-colors ${
                      i === cursor ? "bg-white/[0.07]" : ""
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 shrink-0 ${
                        i === cursor ? "bg-signal" : "bg-transparent"
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-mono text-[0.82rem] uppercase tracking-[0.06em] text-chalk">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block truncate text-small text-chalk-mute">
                        {item.hint}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`shrink-0 font-mono text-mono ${
                        i === cursor ? "text-signal" : "text-transparent"
                      }`}
                    >
                      ↵
                    </span>
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="hidden items-center justify-between border-t border-rule-inv px-5 py-3 sm:flex">
          <MonoLabel className="text-chalk-mute">↑ ↓ TO MOVE · ↵ TO OPEN</MonoLabel>
          <MonoLabel className="text-chalk-mute">
            {String(results.length).padStart(2, "0")} RESULTS
          </MonoLabel>
        </div>
      </div>
    </div>
  );
}
