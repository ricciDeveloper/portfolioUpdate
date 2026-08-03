"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Início" },
  { href: "/projetos", label: "Projetos" },
  { href: "/contato", label: "Contato" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    const nextTheme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : preferredTheme;
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("theme", nextTheme);
  }

  return <header className="site-header"><nav className="container navigation" aria-label="Navegação principal"><Link href="/" className="brand" aria-label="Página inicial"><Image src="/assets/images/logo_png.png" alt="João Ricci Developer" width={240} height={96} priority /></Link><div className="navigation-actions"><button className="theme-button" type="button" onClick={toggleTheme} aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}>{theme === "dark" ? "☀" : "☾"}</button><button className="menu-button" type="button" aria-expanded={isOpen} aria-controls="main-menu" onClick={() => setIsOpen(!isOpen)}>Menu</button></div><ul id="main-menu" className={isOpen ? "menu menu-open" : "menu"}>{links.map((link) => <li key={link.href}><Link href={link.href} onClick={() => setIsOpen(false)}>{link.label}</Link></li>)}</ul></nav></header>;
}
