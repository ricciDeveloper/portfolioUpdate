"use client";

import { FormEvent, useState } from "react";

const initialValues = { name: "", email: "", message: "" };

export function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [feedback, setFeedback] = useState<string>();
  const [isSending, setIsSending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setFeedback(undefined);
    const response = await fetch("/api/contatos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = await response.json() as { message?: string };
    setIsSending(false);
    setFeedback(body.message ?? "Não foi possível enviar sua mensagem.");
    if (response.ok) setValues(initialValues);
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <label>Nome<input required minLength={2} value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} /></label>
      <label>E-mail<input required type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} /></label>
      <label>Mensagem<textarea required minLength={10} rows={6} value={values.message} onChange={(event) => setValues({ ...values, message: event.target.value })} /></label>
      <button type="submit" disabled={isSending}>{isSending ? "Enviando..." : "Enviar mensagem"}</button>
      {feedback ? <p className="form-feedback" role="status">{feedback}</p> : null}
    </form>
  );
}
