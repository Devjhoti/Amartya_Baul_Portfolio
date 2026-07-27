"use client";

import { useRef, useState } from "react";
import Button from "@/components/ui/Button";
import MonoLabel from "@/components/ui/MonoLabel";
import MagneticWrap from "@/components/ui/MagneticWrap";

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

export default function ContactForm({ endpoint, email }) {
  const formRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});

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
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

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

      {/* status — written out, announced politely. PRD §5.10 */}
      <div aria-live="polite" className="min-h-6">
        {status === "sent" ? (
          <p className="max-w-[44ch] text-body">Message sent. I&apos;ll reply within 24 hours.</p>
        ) : null}
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
