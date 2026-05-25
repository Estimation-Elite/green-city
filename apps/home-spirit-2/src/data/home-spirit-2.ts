import type { LegalData } from "@repo/ui";

export const siteConfig = {
  projectName: "Home Spirit 2",
  city: "Toulouse",
  developer: "Sporting Promotion & GreenCity Immobilier",
};

export const headerData = {
  projectLogoSrc: "/images/greencity-logo.png",
  projectLogoAlt: "GreenCity Immobilier",
  partnerLogoSrc: "/images/sporting_promotion-logo.svg",
  partnerLogoAlt: "Sporting Promotion",
  navLinks: [
    { label: "Programme", href: "#programme" },
    { label: "Habiter", href: "#habiter" },
    // { label: "Investir", href: "#investir" },
    { label: "Localisation", href: "#localisation" },
    { label: "Contact", href: "#contact" },
  ],
  //ctaLabel: "Nous appeler",
  ctaHref: "tel:+33500000000",
};

export const photoGalleryData = {
  sectionLabel: "Découvrez votre futur chez-vous",
  sectionTitle: "Galerie",
  highlightedTitle: "Photo",
  subtitle: "Explorez les espaces de vie conçus pour votre bien-être",
  photos: [
    {
      src: "/images/HomeSpirit2_VueIlot_01.jpg",
      alt: "Vue d'ensemble de la résidence Home Spirit 2 à Toulouse Montaudran",
      tag: "Résidence",
      title: "Vue d'ensemble",
      description:
        "Architecture contemporaine aux balcons arrondis dans un environnement végétalisé",
    },
    {
      src: "/images/HomeSpirit2_VuePiste_Web.jpg",
      alt: "Vue de Home Spirit 2 depuis la piste des Géants",
      tag: "Extérieur",
      title: "Depuis la Piste des Géants",
      description:
        "La résidence s'intègre harmonieusement dans le paysage du quartier Aerospace",
    },
    {
      src: "/images/HomeSpirit2_Interieur_Web.jpg",
      alt: "Intérieur lumineux d'un appartement Home Spirit 2",
      tag: "Intérieur",
      title: "Séjour lumineux",
      description:
        "Des espaces de vie fonctionnels et lumineux avec des finitions contemporaines",
    },
    {
      src: "/images/HomeSpirit2_Terrasse_Web.jpg",
      alt: "Terrasse en attique d'un appartement T5 Home Spirit 2",
      tag: "Terrasse",
      title: "Terrasse en attique",
      description:
        "De généreux espaces extérieurs pour profiter du climat toulousain",
    },
    {
      src: "/images/HomeSpirit2_VueRue_01.jpg",
      alt: "Vue de la résidence Home Spirit 2 depuis la rue",
      tag: "Architecture",
      title: "Vue depuis la rue",
      description:
        "Des lignes douces et des coursives végétalisées, signature du projet",
    },
    {
      src: "/images/HomeSpirit2_VueRooftop_Web.jpg",
      alt: "Vue du rooftop de Home Spirit 2",
      tag: "Rooftop",
      title: "Vue rooftop",
      description:
        "Un cadre de vie ouvert sur le quartier Aerospace-Montaudran",
    },
  ],
};

export const socialProofData = {
  lotsAvailable: 23,
  totalLots: 79,
};

export const brochureData = {
  pdfUrl: "/documents/HomeSpirit2-Brochure.pdf",
  pdfFilename: "HomeSpirit2-Brochure.pdf",
};

export const availableLots = 34;

export const footerData = {
  projectName: "Home Spirit 2",
  developerName: "Sporting Promotion & GreenCity Immobilier",
  logoSrc: "/images/greencity-logo-footer.png",
  partnerLogoSrc: "/images/sporting_promotion-logo.svg",
  partnerLogoAlt: "Sporting Promotion",
  phone: "",
  email: "",
  address: "",
  legalLinks: [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Politique de confidentialité", href: "/politique-de-confidentialite" },
    { label: "Cookies", href: "/cookies" },
  ],
};

// TODO RGPD: compléter avec les vraies informations légales du client
// (raison sociale, SIRET, hébergeur réel, DPO). Les valeurs manquantes seront
// affichées comme "[À compléter — ...]" sur les pages publiées.
export const legalData: LegalData = {
  companyName: "GreenCity Immobilier",
  companyLegalForm: "",
  companyCapital: "",
  companyAddress: "",
  companyRcs: "",
  companySiret: "",
  companyVat: "",
  companyPhone: "",
  companyEmail: "",
  publicationDirector: "",
  hostingProvider: "",
  hostingAddress: "",
  hostingPhone: "",
  dpoName: "",
  dpoEmail: "",
  programName: "Home Spirit 2",
  projectAddress: "Toulouse, quartier Montaudran",
};
