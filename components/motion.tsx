"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Un solo observador para todo el sitio: marca `data-in` en cada `[data-reveal]` al entrar en pantalla.
 *  Lo que ya está visible al montar se marca antes de ocultar nada (sin parpadeo); sin JS, todo queda visible. */
export function RevealObserver() {
  const path = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-in])"));
    const vh = window.innerHeight;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) el.setAttribute("data-in", "");
    }
    root.classList.add("reveal-ready");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-in", "");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -4% 0px", threshold: 0 },
    );
    els.filter((el) => !el.hasAttribute("data-in")).forEach((el) => io.observe(el));
    const all = () => els.forEach((el) => el.setAttribute("data-in", ""));
    window.addEventListener("beforeprint", all);
    return () => {
      io.disconnect();
      window.removeEventListener("beforeprint", all);
    };
  }, [path]);
  return null;
}

