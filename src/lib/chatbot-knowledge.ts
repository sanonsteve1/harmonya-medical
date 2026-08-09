export type ChatLocale = "fr" | "en";

export type ChatAction = "contact" | "tour";

export type ChatReply = {
  text: string;
  action?: ChatAction;
  intent?: string;
  pendingOffer?: "contact" | "tour" | null;
};

type Intent = {
  id: string;
  priority: number;
  patterns: RegExp[];
  answer: Record<ChatLocale, string>;
  action?: ChatAction;
  pendingOffer?: "contact" | "tour";
};

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "'")
    .trim();
}

const intents: Intent[] = [
  {
    id: "tour",
    priority: 100,
    patterns: [
      /\bvisite\s+guidee?\b/,
      /\bguided?\s+tour\b/,
      /\bvisite\s+du\s+site\b/,
      /\bfaire\s+(une\s+)?visite\b/,
      /\bparcourir\s+(le\s+)?site\b/,
      /\bmontrer\s+(le\s+)?site\b/,
      /\btour\s+(du\s+)?site\b/,
      /\bguide\s*(moi|nous|me)?\b/,
      /\bvisiter\s+(le\s+)?site\b/,
    ],
    answer: {
      fr: "Avec plaisir ! Je lance une visite guidée du site : Accueil → À propos → Services → Produits → Contact. Suivez le défilement.",
      en: "Gladly! I’m starting a guided tour: Home → About → Services → Products → Contact. Follow the scroll.",
    },
    action: "tour",
  },
  {
    id: "greeting",
    priority: 40,
    patterns: [
      /^(bonjour|bonsoir|salut|hello|hi|hey|coucou)\b/,
      /\bgood\s+(morning|evening|afternoon)\b/,
    ],
    answer: {
      fr: "Bonjour ! Je suis l’assistant HARMONYA MEDICAL. Je peux vous présenter nos services, nos produits, lancer une visite guidée du site, ou vous amener au formulaire de contact.",
      en: "Hello! I’m the HARMONYA MEDICAL assistant. I can present our services and products, start a guided site tour, or take you to the contact form.",
    },
  },
  {
    id: "services",
    priority: 60,
    patterns: [
      /\bservices?\b/,
      /\bpromotion\s+medicale\b/,
      /\bformation\b/,
      /\bpartenariats?\b/,
      /\bpartnerships?\b/,
      /\bdistribution\b/,
      /\blogistique\b/,
      /\bprescripteurs?\b/,
      /\btraining\b/,
      /\bdomaines?\b/,
    ],
    answer: {
      fr: "Nos 4 domaines d’intervention :\n• Promotion médicale éthique\n• Formation & information scientifique\n• Partenariats stratégiques\n• Distribution & logistique\n\nSouhaitez-vous que je vous oriente vers le formulaire de contact ?",
      en: "Our 4 areas of expertise:\n• Ethical medical promotion\n• Scientific training & information\n• Strategic partnerships\n• Distribution & logistics\n\nWould you like me to take you to the contact form?",
    },
    pendingOffer: "contact",
  },
  {
    id: "products",
    priority: 60,
    patterns: [
      /\bproduits?\b/,
      /\bproducts?\b/,
      /\bgammes?\b/,
      /\bcardiologie\b/,
      /\bcardio\b/,
      /\bneurologie\b/,
      /\bneuro\b/,
      /\banti[- ]?infectieux\b/,
      /\bmedecine\s+generale\b/,
    ],
    answer: {
      fr: "Nous accompagnons des gammes en anti-infectieux, neurologie, cardiologie et médecine générale. Pour un besoin précis, je peux vous amener au formulaire de contact.",
      en: "We support ranges in anti-infectives, neurology, cardiology, and general medicine. For a specific need, I can take you to the contact form.",
    },
    pendingOffer: "contact",
  },
  {
    id: "about",
    priority: 55,
    patterns: [
      /\bqui\s+(etes|est)\b/,
      /\ba\s+propos\b/,
      /\babout\b/,
      /\bmission\b/,
      /\bagence\b/,
      /\bharmonya\b/,
      /\bentreprise\b/,
      /\bsociete\b/,
    ],
    answer: {
      fr: "HARMONYA MEDICAL est une agence de promotion de produits pharmaceutiques basée à Ouagadougou. Notre mission : faciliter l’accès à des traitements de qualité grâce à une promotion médicale responsable en Afrique de l’Ouest.",
      en: "HARMONYA MEDICAL is a pharmaceutical product promotion agency based in Ouagadougou. Our mission: improve access to quality treatments through responsible medical promotion in West Africa.",
    },
  },
  {
    id: "contact",
    priority: 70,
    patterns: [
      /\bcontacts?\b/,
      /\bcontacter\b/,
      /\bemails?\b/,
      /\bmails?\b/,
      /\btelephones?\b/,
      /\bphones?\b/,
      /\bjoindre\b/,
      /\becrire\b/,
      /\bdevis\b/,
      /\brendez[- ]?vous\b/,
      /\brdv\b/,
      /\bformulaire\b/,
      /\bforms?\b/,
    ],
    answer: {
      fr: "Parfait — je vous oriente vers le formulaire de contact. Vous pouvez aussi écrire à contact@harmonyamedical.com (réponse sous 24 à 48 h ouvrées).",
      en: "Perfect — I’ll take you to the contact form. You can also email contact@harmonyamedical.com (reply within 24–48 business hours).",
    },
    action: "contact",
  },
  {
    id: "location",
    priority: 65,
    patterns: [
      /\bou\s+(etes|etes-vous|se\s+trouve|trouvez)\b/,
      /\bsitues?\b/,
      /\blocalisation\b/,
      /\badresse\b/,
      /\bouagadougou\b/,
      /\bburkina\b/,
      /\bwhere\s+(are|is)\b/,
      /\blocation\b/,
      /\baddress\b/,
      /\bbased\b/,
    ],
    answer: {
      fr: "Nous sommes basés à Ouagadougou, Burkina Faso, avec une couverture en Afrique de l’Ouest (+8 pays d’intervention).",
      en: "We are based in Ouagadougou, Burkina Faso, with coverage across West Africa (+8 countries of operation).",
    },
  },
  {
    id: "newsletter",
    priority: 50,
    patterns: [/\bnewsletter\b/, /\bactualites?\b/, /\binscription\b/, /\bsubscribe\b/],
    answer: {
      fr: "Vous pouvez vous inscrire à la newsletter en bas de page avec votre e-mail et le consentement associé.",
      en: "You can subscribe to the newsletter in the site footer with your email and consent.",
    },
  },
  {
    id: "thanks",
    priority: 30,
    patterns: [/\bmerci\b/, /\bthanks?\b/, /\bthank\s+you\b/, /\bsuper\b/, /\bparfait\b/],
    answer: {
      fr: "Avec plaisir. Je peux aussi lancer une visite guidée du site si vous voulez.",
      en: "You’re welcome. I can also start a guided site tour if you’d like.",
    },
    pendingOffer: "tour",
  },
];

const yesPatterns = [
  /^(oui|ouais|ok|okay|d'accord|daccord|volontiers|avec\s+plaisir|yes|yep|sure|of\s+course|please)\b/,
];
const noPatterns = [
  /^(non|nan|pas\s+maintenant|no|nope|not\s+now)\b/,
];

export function getChatReply(
  input: string,
  locale: ChatLocale,
  pendingOffer: "contact" | "tour" | null = null,
): ChatReply {
  const normalized = normalize(input);

  if (!normalized) {
    return {
      text:
        locale === "fr"
          ? "Pouvez-vous préciser votre question ?"
          : "Could you clarify your question?",
      pendingOffer: null,
    };
  }

  // Affirmation / negation depending on last bot offer
  if (pendingOffer && yesPatterns.some((p) => p.test(normalized))) {
    if (pendingOffer === "contact") {
      return {
        text:
          locale === "fr"
            ? "Très bien, je vous emmène au formulaire de contact."
            : "Great, I’ll take you to the contact form.",
        action: "contact",
        intent: "confirm_contact",
        pendingOffer: null,
      };
    }
    return {
      text:
        locale === "fr"
          ? "Parfait, je lance la visite guidée du site."
          : "Perfect, starting the guided site tour.",
      action: "tour",
      intent: "confirm_tour",
      pendingOffer: null,
    };
  }

  if (pendingOffer && noPatterns.some((p) => p.test(normalized))) {
    return {
      text:
        locale === "fr"
          ? "Aucun problème. Je reste disponible pour vos questions (services, produits, visite guidée…)."
          : "No problem. I’m here for your questions (services, products, guided tour…).",
      intent: "decline",
      pendingOffer: null,
    };
  }

  let best: { intent: Intent; score: number } | null = null;

  for (const intent of intents) {
    let hits = 0;
    for (const pattern of intent.patterns) {
      if (pattern.test(normalized)) hits += 1;
    }
    if (hits === 0) continue;
    const score = hits * 10 + intent.priority;
    if (!best || score > best.score) {
      best = { intent, score };
    }
  }

  if (!best) {
    return {
      text:
        locale === "fr"
          ? "Je n’ai pas bien compris. Vous pouvez demander : « visite guidée », « services », « produits », « contact » ou « adresse »."
          : "I didn’t quite get that. You can ask for: “guided tour”, “services”, “products”, “contact”, or “address”.",
      pendingOffer: null,
    };
  }

  return {
    text: best.intent.answer[locale],
    action: best.intent.action,
    intent: best.intent.id,
    pendingOffer: best.intent.pendingOffer ?? null,
  };
}

export const tourSteps = [
  { id: "accueil", fr: "Accueil — présentation HARMONYA MEDICAL", en: "Home — HARMONYA MEDICAL overview" },
  { id: "a-propos", fr: "À propos — notre mission", en: "About — our mission" },
  { id: "services", fr: "Services — nos domaines d’intervention", en: "Services — our areas of expertise" },
  { id: "produits", fr: "Produits — nos gammes", en: "Products — our ranges" },
  { id: "contact", fr: "Contact — parlons de votre projet", en: "Contact — let’s discuss your project" },
] as const;

export const quickReplies: Record<
  ChatLocale,
  { label: string; value: string }[]
> = {
  fr: [
    { label: "Visite guidée", value: "Peux-tu me faire une visite guidée ?" },
    { label: "Nos services", value: "Quels sont vos services ?" },
    { label: "Produits", value: "Parlez-moi de vos produits" },
    { label: "Nous contacter", value: "formulaire" },
  ],
  en: [
    { label: "Guided tour", value: "Can you give me a guided tour?" },
    { label: "Our services", value: "What are your services?" },
    { label: "Products", value: "Tell me about your products" },
    { label: "Contact us", value: "form" },
  ],
};
