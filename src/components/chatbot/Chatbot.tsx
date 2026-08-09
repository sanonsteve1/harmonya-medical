"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import {
  getChatReply,
  quickReplies,
  tourSteps,
  type ChatLocale,
} from "@/lib/chatbot-knowledge";

type Message = {
  id: string;
  role: "bot" | "user";
  text: string;
};

const ui = {
  fr: {
    title: "Assistant HARMONYA",
    subtitle: "Réponses instantanées",
    placeholder: "Écrivez votre message…",
    send: "Envoyer",
    open: "Ouvrir le chat",
    close: "Fermer le chat",
    launcher: "Besoin d'aide ?",
    welcome:
      "Bonjour ! Je peux vous renseigner ou lancer une visite guidée du site. Que souhaitez-vous ?",
    tourDone:
      "Visite terminée. Souhaitez-vous être mis en relation via le formulaire de contact ?",
  },
  en: {
    title: "HARMONYA Assistant",
    subtitle: "Instant answers",
    placeholder: "Type your message…",
    send: "Send",
    open: "Open chat",
    close: "Close chat",
    launcher: "Need help?",
    welcome:
      "Hello! I can answer questions or start a guided tour of the site. What would you like?",
    tourDone:
      "Tour complete. Would you like me to take you to the contact form?",
  },
} as const;

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function Chatbot() {
  const locale = (useLocale() === "en" ? "en" : "fr") as ChatLocale;
  const t = ui[locale];
  const [open, setOpen] = useState(true);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [pendingOffer, setPendingOffer] = useState<"contact" | "tour" | null>(
    null,
  );
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "bot", text: t.welcome },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const localeRef = useRef(locale);
  const pendingRef = useRef<"contact" | "tour" | null>(null);
  const tourTimerRef = useRef<number[]>([]);

  useEffect(() => {
    pendingRef.current = pendingOffer;
  }, [pendingOffer]);

  useEffect(() => {
    if (localeRef.current === locale) return;
    localeRef.current = locale;
    setMessages([{ id: createId(), role: "bot", text: t.welcome }]);
    setInput("");
    setPendingOffer(null);
  }, [locale, t.welcome]);

  useEffect(() => {
    if (!open) return;
    const node = listRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, typing, open]);

  useEffect(() => {
    return () => {
      tourTimerRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  function pushBot(text: string, delay = 450) {
    setTyping(true);
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { id: createId(), role: "bot", text }]);
      setTyping(false);
    }, delay);
  }

  function runGuidedTour() {
    tourTimerRef.current.forEach((id) => window.clearTimeout(id));
    tourTimerRef.current = [];
    setOpen(false);

    tourSteps.forEach((step, index) => {
      const timer = window.setTimeout(() => {
        document
          .getElementById(step.id)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });

        if (index === tourSteps.length - 1) {
          const doneTimer = window.setTimeout(() => {
            setOpen(true);
            setPendingOffer("contact");
            setMessages((prev) => [
              ...prev,
              { id: createId(), role: "bot", text: t.tourDone },
            ]);
          }, 1200);
          tourTimerRef.current.push(doneTimer);
        }
      }, index * 2200);
      tourTimerRef.current.push(timer);
    });
  }

  function handleReply(raw: string) {
    const value = raw.trim();
    if (!value || typing) return;

    setMessages((prev) => [...prev, { id: createId(), role: "user", text: value }]);
    setInput("");

    const reply = getChatReply(value, locale, pendingRef.current);
    setPendingOffer(reply.pendingOffer ?? null);
    pushBot(reply.text);

    if (reply.action === "contact") {
      window.setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }, 700);
    }

    if (reply.action === "tour") {
      window.setTimeout(() => runGuidedTour(), 700);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    handleReply(input);
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[85] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <section
          className="pointer-events-auto flex h-[min(34rem,calc(100svh-8rem))] w-[min(100vw-1.5rem,24rem)] flex-col overflow-hidden rounded-[1.5rem] border-2 border-teal/50 bg-white shadow-[0_24px_70px_rgba(0,194,204,0.28),0_16px_40px_rgba(7,26,61,0.2)]"
          aria-label={t.title}
        >
          <header className="flex items-start justify-between gap-3 bg-gradient-to-r from-navy to-navy-soft px-4 py-3.5 text-white">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal" />
                </span>
                <p className="truncate text-sm font-bold">{t.title}</p>
              </div>
              <p className="mt-0.5 text-xs text-white/70">{t.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={t.close}
            >
              <CloseIcon />
            </button>
          </header>

          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto bg-mist/40 px-3 py-3"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "rounded-br-md bg-navy text-white"
                      : "rounded-bl-md border border-line bg-white text-navy shadow-sm"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-line bg-white px-3.5 py-3 shadow-sm">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal [animation-delay:120ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal [animation-delay:240ms]" />
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-line bg-white px-3 py-2">
            <div className="flex gap-1.5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {quickReplies[locale].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleReply(item.value)}
                  disabled={typing}
                  className="shrink-0 rounded-full border border-line bg-mist px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:border-teal hover:bg-teal-soft disabled:opacity-60"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit} className="flex items-center gap-2 pb-1">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder}
                className="min-w-0 flex-1 rounded-full border border-line bg-mist/50 px-3.5 py-2.5 text-sm text-navy outline-none placeholder:text-slate/60 focus:border-teal"
              />
              <button
                type="submit"
                disabled={typing || !input.trim()}
                aria-label={t.send}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal text-navy-deep transition-[transform,background-color] hover:bg-teal-dark hover:text-white active:scale-[0.96] disabled:opacity-50"
              >
                <SendIcon />
              </button>
            </form>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto group relative inline-flex items-center gap-2.5 rounded-full bg-teal px-4 py-3.5 text-navy-deep shadow-[0_0_0_4px_rgba(0,194,204,0.25),0_16px_40px_rgba(0,194,204,0.45)] transition-[transform,background-color,box-shadow] hover:bg-white hover:shadow-[0_0_0_6px_rgba(0,194,204,0.3),0_18px_44px_rgba(0,194,204,0.5)] active:scale-[0.96]"
        aria-label={open ? t.close : t.open}
        aria-expanded={open}
      >
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-teal/40 opacity-40" />
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white shadow-sm">
          {open ? <CloseIcon /> : <ChatIcon />}
        </span>
        <span className="pr-1 text-sm font-bold tracking-wide">
          {open ? t.close : t.launcher}
        </span>
        {!open && (
          <span className="absolute right-2 top-1.5 h-3 w-3 rounded-full border-2 border-white bg-navy" />
        )}
      </button>
    </div>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path
        d="M5 6.5A2.5 2.5 0 017.5 4h9A2.5 2.5 0 0119 6.5v7A2.5 2.5 0 0116.5 16H10l-3.8 3.2c-.5.4-1.2.05-1.2-.6V6.5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 9h7M8.5 12h4.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M7 7l10 10M17 7L7 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M5 12l14-7-4 14-3-5-7-2z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}
