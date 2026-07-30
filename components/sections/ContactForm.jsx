"use client";

import { useRef, useState } from "react";
import Button from "@/components/ui/Button";
import MonoLabel from "@/components/ui/MonoLabel";
import MagneticWrap from "@/components/ui/MagneticWrap";
import { play } from "@/lib/sound";

/**
 * The contact form, wired: client-side validation with inline field-level
 * messages (no browser default UI), JSON POST to Formspree with
 * Accept: application/json, honeypot _gotcha, and four written states —
 * idle, sending, sent, error — announced through an aria-live region. Fully
 * keyboard-operable; focus rings are the global signal ring. PRD §5.10
 */
const FIELD =
  "w-full border-b border-rule-inv bg-transparent pb-3 pt-2 font-body text-body text-chalk placeholder:text-chalk-mute";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};
  if (!values.name?.trim() || values.name.trim().length < 2) {
    errors.name = "Your name, so I know who is writing.";
  }
  if (!values.email?.trim()) {
    errors.email = "An email address, so the reply has somewhere to go.";
  } else if (!EMAIL_RX.test(values.email.trim())) {
    errors.email = "That email address doesn't look complete.";
  }
  if (!values.message?.trim() || values.message.trim().length < 10) {
    errors.message = "A few lines about the build — what it is and when you need it.";
  }
  return errors;
}

function Field({ id, name, label, error, textarea, ...rest }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <div>
      <MonoLabel as="label" htmlFor={id} className="block text-chalk-mute">
        {label}
      </MonoLabel>
      <Tag
        id={id}
        name={name}
        className={FIELD}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error ? (
        <MonoLabel as="p" id={`${id}-error`} className="mt-2 text-signal">
          {error}
        </MonoLabel>
      ) : null}
    </div>
  );
}

/**
 * A reference the sender can quote back. Derived from the clock rather than
 * random, so it reads like a docket off a real system: year, then a
 * five-minute slot of the day. Two enquiries in the same five minutes would
 * collide, which is a volume problem worth having.
 */
function ticketNumber() {
  const now = new Date();
  const slot = Math.floor((now.getHours() * 60 + now.getMinutes()) / 5);
  return `REQ-${now.getFullYear()}-${String(slot).padStart(3, "0")}`;
}

export default function ContactForm({ endpoint, email }) {
  const formRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const [receipt, setReceipt] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    const values = Object.fromEntries(new FormData(form).entries());

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      form.querySelector("[aria-invalid]")?.focus?.();
      // fallback: focus the first field that just failed
      const first = ["name", "email", "message"].find((k) => nextErrors[k]);
      form.elements[first]?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setReceipt({
        ref: ticketNumber(),
        name: values.name?.trim().split(/\s+/)[0] ?? "",
      });
      setStatus("sent");
      play("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  /* The form has done its job; leaving it on screen invites a second send.
     What replaces it is a docket — the light, the reference, the promise. */
  if (status === "sent" && receipt) {
    return (
      <div
        role="status"
        className="relative overflow-hidden rounded-2xl border border-white/12 bg-[rgba(28,34,30,0.55)] p-8 backdrop-blur-md motion-safe:animate-[receipt-in_.5s_cubic-bezier(.16,1,.3,1)_both] sm:p-10"
      >
        {/* inset, not cornered: at this radius a corner square gets shaved
            into a triangle and reads as a rendering fault */}
        <span aria-hidden="true" className="absolute left-8 top-0 h-[3px] w-10 bg-signal sm:left-10" />

        <MonoLabel className="flex items-center gap-2.5 text-chalk-mute">
          <span
            aria-hidden="true"
            className="inline-block h-1.5 w-1.5 rounded-full bg-signal motion-safe:animate-pulse"
          />
          MESSAGE LOGGED
        </MonoLabel>

        {/* sentence case, not the uppercase plate voice: −0.03em tracking
            closes the word space to nothing in caps, and a thank-you is the
            one line on the page that should sound like a person */}
        <p className="mt-6 font-display text-[clamp(1.6rem,4.6vw,2.4rem)] leading-display tracking-display text-chalk">
          {receipt.name ? `Thank you, ${receipt.name}.` : "Thank you."}
        </p>

        <p className="mt-4 max-w-[42ch] text-body text-chalk-mute">
          It&apos;s with me. I reply within 24 hours — usually the same day, Dhaka
          time. If it&apos;s urgent, WhatsApp is faster.
        </p>

        <dl className="mt-8 grid gap-x-8 gap-y-5 border-t border-rule-inv pt-6 sm:grid-cols-2">
          <div>
            <MonoLabel as="dt" className="text-chalk-mute">
              REFERENCE
            </MonoLabel>
            <dd className="mt-2 font-mono text-mono uppercase tracking-mono text-signal">
              {receipt.ref}
            </dd>
          </div>
          <div>
            <MonoLabel as="dt" className="text-chalk-mute">
              REPLY WINDOW
            </MonoLabel>
            <dd className="mt-2 font-mono text-mono uppercase tracking-mono text-chalk">
              WITHIN 24 HOURS
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setReceipt(null);
            }}
            className="link-draw font-mono text-mono uppercase tracking-mono text-chalk-mute transition-colors hover:text-chalk"
          >
            Send another
          </button>
          <a
            href={`mailto:${email}`}
            className="link-draw font-mono text-mono uppercase tracking-mono text-chalk-mute transition-colors hover:text-chalk"
          >
            Or email directly
          </a>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-10">
      <Field id="contact-name" name="name" label="NAME" type="text" autoComplete="name" placeholder="Your name" error={errors.name} />
      <Field id="contact-email" name="email" label="EMAIL" type="email" autoComplete="email" placeholder="you@company.com" error={errors.email} />
      <Field id="contact-company" name="company" label="COMPANY — OPTIONAL" type="text" autoComplete="organization" placeholder="Company or project" />
      <Field id="contact-message" name="message" label="MESSAGE" textarea rows={5} placeholder="What are you building, and when does it need to be live?" error={errors.message} />

      {/* Honeypot — real users never see or fill this. PRD §5.10 */}
      <div className="hidden" aria-hidden="true">
        <label>
          Leave this field empty
          <input name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <MagneticWrap>
          <Button type="submit" tone="dark" className={status === "sending" ? "opacity-60" : ""}>
            {status === "sending" ? "Sending…" : "Send message"}
          </Button>
        </MagneticWrap>
      </div>

      {/* status — written out, announced politely. A send that lands replaces
          the whole form with the docket above, so only the failure speaks
          here. PRD §5.10 */}
      <div aria-live="polite" className="min-h-6">
        {status === "error" ? (
          <p className="max-w-[44ch] text-body">
            That didn&apos;t send. Email me directly at{" "}
            <a href={`mailto:${email}`} className="underline decoration-1 underline-offset-4 hover:decoration-signal">
              {email}
            </a>{" "}
            and I&apos;ll get back to you today.
          </p>
        ) : null}
      </div>
    </form>
  );
}
