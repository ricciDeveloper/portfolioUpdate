"use client";
import { FormEvent, useState } from "react";
const initialValues = { name: "", email: "", message: "" };
export function ContactForm() {
 const [values,setValues]=useState(initialValues);const [feedback,setFeedback]=useState<string>();const [isSending,setIsSending]=useState(false);
 async function onSubmit(event:FormEvent<HTMLFormElement>){event.preventDefault();setIsSending(true);setFeedback(undefined);try{const response=await fetch("/api/contatos",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(values)});const body=await response.json() as {message?:string};setFeedback(body.message??"Não foi possível enviar sua mensagem.");if(response.ok)setValues(initialValues);}catch{setFeedback("Não foi possível enviar sua mensagem agora.");}finally{setIsSending(false);}}
 return <form className="contact-form" onSubmit={onSubmit}><label>Nome<input required minLength={2} maxLength={120} value={values.name} onChange={e=>setValues({...values,name:e.target.value})}/></label><label>E-mail<input required type="email" maxLength={254} value={values.email} onChange={e=>setValues({...values,email:e.target.value})}/></label><label>Mensagem<textarea required minLength={10} maxLength={5000} rows={6} value={values.message} onChange={e=>setValues({...values,message:e.target.value})}/></label><button type="submit" disabled={isSending}>{isSending?"Enviando...":"Enviar mensagem"}</button>{feedback&&<p className="form-feedback" role="status">{feedback}</p>}</form>;
}
