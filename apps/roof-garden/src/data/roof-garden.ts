export const siteConfig = {
  projectName: "Roof Garden",
  city: "Grenoble",
  developer: "GreenCity Immobilier",
};

export const headerData = {
  projectLogoSrc: "/images/greencity-logo.png",
  projectLogoAlt: "Roof Garden",
  navLinks: [
    { label: "Le projet", href: "#value-proposition" },
    { label: "Galerie", href: "#galerie" },
    { label: "Localisation", href: "#localisation" },
    { label: "Contact", href: "#contact" },
  ],
  ctaLabel: "Télécharger la brochure",
  ctaHref: "#contact",
};

export const heroData = {
  backgroundImageSrc: "/images/salon.png",
  partnerLogoSrc: "/images/greencity-logo.png",
  partnerLogoAlt: "GreenCity Immobilier",
  headline: "Vivez chaque matin face au",
  highlightedText: "Vercors",
  subtitle:
    "Appartements 1 à 4 pièces · Ouvrez vos volets sur le Vercors\nDevenez propriétaire à partir de 490€/mois",
  locationBadge: "GRENOBLE",
  stats: [
    { value: "10/28", label: "Appartements disponibles" },
    { value: "€490", label: "à partir de/mois" },
    { value: "10", label: "Min du centre" },
  ],
  countdown: {
    targetDate: "2025-07-31",
    label: "Offre valable jusqu'au 31 juillet 2025",
  },
  trustpilot: {
    rating: 4.9,
    reviewCount: 127,
    label: "familles accompagnées",
  },
  primaryCta: { label: "Télécharger la brochure", href: "#contact" },
  secondaryCta: { label: "Découvrir les appartements", href: "#galerie" },
};

export const valuePropositionData = {
  sectionLabel: "Un programme d'exception à Grenoble",
  sectionTitle: "Votre nouveau",
  highlightedTitle: "chez-vous",
  subtitle:
    "Découvrez un art de vivre unique au cœur de Grenoble, où modernité et nature se rencontrent pour créer votre refuge parfait.",
  items: [
    {
      title: "Un cadre de vie apaisant sans quitter la ville",
      description:
        "Panorama exceptionnel sur le Vercors, verdure à perte de vue",
    },
    {
      title: "Un logement durable et bien pensé",
      description:
        "Construction RT2012, matériaux écologiques, charges maîtrisées",
    },
    {
      title: "Un premier achat accessible",
      description:
        "PTZ à Taux Zéro, dispositif Pinel, accompagnement personnalisé",
    },
    {
      title: "Un endroit où fonder, agrandir ou sécuriser votre famille",
      description:
        "Espaces optimisés, balcons, proximité écoles et commerces",
    },
  ],
};

export const equipmentData = {
  sectionTitle: "Équipements et services inclus",
  items: [
    { icon: "trees", label: "Jardins sur toit", sublabel: "Inclus" },
    { icon: "shield", label: "Parkings sécurisés", sublabel: "Inclus" },
    { icon: "wifi", label: "Fibre optique", sublabel: "Inclus" },
    { icon: "building", label: "Commerces à 5min", sublabel: "Proximité" },
    { icon: "zap", label: "Bornes électriques", sublabel: "Eco" },
    { icon: "sun", label: "Terrasses privées", sublabel: "Premium" },
  ],
  ctaBanner: {
    message: "L'opportunité vous attend",
    subtitle:
      "Seulement 10 logements disponibles sur les 28 du programme",
    actions: [
      { label: "Réserver ma visite", href: "#contact", variant: "default" as const },
      { label: "Télécharger la brochure", href: "#contact", variant: "outline" as const },
    ],
  },
};

export const testimonialsData = {
  sectionLabel: "Témoignages",
  sectionTitle: "Ils ont choisi",
  highlightedTitle: "Roof Garden",
  subtitle:
    "Découvrez les histoires de nos résidents qui ont trouvé leur bonheur",
  testimonials: [
    {
      name: "Jean-Pierre B.",
      role: "Appartement T3 - Étage 6",
      quote:
        "Un investissement intelligent ! La qualité de construction est remarquable et la localisation parfaite. Le retour sur investissement dépasse nos attentes.",
      rating: 5,
    },
    {
      name: "Marie-Claire D.",
      role: "Appartement T4 - Étage 4",
      quote:
        "Nous avons trouvé le cadre de vie parfait pour notre famille. Les jardins partagés sont un vrai plus et la vue sur le Vercors est magnifique chaque matin.",
      rating: 5,
    },
    {
      name: "Thomas L.",
      role: "Appartement T2 - Étage 3",
      quote:
        "En tant que primo-accédant, j'ai été accompagné de A à Z. Le PTZ et les aides ont rendu mon projet possible. Je recommande vivement !",
      rating: 5,
    },
  ],
  stats: [
    { value: "4,9/5", label: "Note moyenne" },
    { value: "127", label: "Avis clients" },
    { value: "89%", label: "Recommandent" },
    { value: "15j", label: "Délai moyen vente" },
  ],
};

export const conversationsData = {
  sectionTitle: "Conversations récentes",
  conversations: [
    {
      clientName: "Marie L.",
      status: "En cours de négociation",
      messages: [
        {
          sender: "Marie",
          message:
            "Bonjour, est-ce que les T3 sont encore disponibles avec vue sur les montagnes ?",
          time: "14:32",
          isAgent: false,
        },
        {
          sender: "Roof Garden",
          message:
            "Bonjour Marie ! Oui, nous avons encore 2 T3 disponibles aux étages 4 et 6 avec vue sur le Vercors. Souhaitez-vous planifier une visite ?",
          time: "14:35",
          isAgent: true,
        },
      ],
    },
    {
      clientName: "Thomas P.",
      status: "En cours de négociation",
      messages: [
        {
          sender: "Thomas",
          message:
            "Je suis très intéressé par le T2 au 3ème étage. Pouvez-vous me donner plus de détails sur les conditions de financement PTZ ?",
          time: "10:15",
          isAgent: false,
        },
        {
          sender: "Roof Garden",
          message:
            "Parfait Thomas ! Je vous envoie immédiatement les conditions de financement. En tant que primo-accédant, vous pouvez bénéficier du PTZ. Pouvez-vous nous partager vos coordonnées ?",
          time: "10:22",
          isAgent: true,
        },
      ],
    },
  ],
};

export const virtualTourData = {
  sectionTitle: "Visite Virtuelle 360°",
  subtitle: "Découvrez votre futur logement depuis chez vous",
  categories: [
    {
      icon: "home",
      title: "Appartements",
      description: "Explorez l'intérieur des logements",
    },
    {
      icon: "tree",
      title: "Espaces verts",
      description: "Découvrez les jardins partagés",
    },
    {
      icon: "mountain",
      title: "Environnement",
      description: "Visualisez la vue sur le Vercors",
    },
  ],
  comingSoon: {
    title: "Visite virtuelle bientôt disponible",
    description:
      "Nous préparons une expérience immersive pour vous faire découvrir les appartements et espaces communs du Roof Garden.",
    ctaLabel: "Être notifié de la disponibilité",
    ctaHref: "#contact",
  },
};

export const photoGalleryData = {
  sectionLabel: "Découvrez votre futur chez-vous",
  sectionTitle: "Galerie",
  highlightedTitle: "Photo",
  subtitle: "Explorez les espaces de vie conçus pour votre bien-être",
  photos: [
    {
      src: "/images/salon.png",
      alt: "Salon avec cuisine ouverte",
      tag: "Espace de vie",
      title: "Salon avec cuisine ouverte",
      description:
        "Espace de vie lumineux avec cuisine équipée et salon moderne",
    },
    {
      src: "/images/chambre.png",
      alt: "Chambre avec vue",
      tag: "Chambre",
      title: "Chambre lumineuse",
      description: "Chambre spacieuse avec vue dégagée et lumière naturelle",
    },
    {
      src: "/images/terrasse.png",
      alt: "Terrasse avec vue sur le Vercors",
      tag: "Extérieur",
      title: "Terrasse panoramique",
      description: "Profitez de la vue sur le Vercors depuis votre terrasse",
    },
  ],
};

export const proximityData = {
  sectionTitle: "Tout à proximité",
  items: [
    { name: "Gare SNCF", duration: "8 min", iconColor: "#3B82F6" },
    { name: "Centre-ville", duration: "10 min", iconColor: "#10B981" },
    { name: "Grand Place", duration: "5 min", iconColor: "#8B5CF6" },
    { name: "Universités", duration: "15 min", iconColor: "#F59E0B" },
    { name: "Parc Paul Mistral", duration: "7 min", iconColor: "#10B981" },
    { name: "CHU Grenoble", duration: "12 min", iconColor: "#EF4444" },
    { name: "Restaurants", duration: "2 min", iconColor: "#F59E0B" },
    { name: "Complexe sportif", duration: "6 min", iconColor: "#3B82F6" },
  ],
};

export const projectOverviewData = {
  sectionTitle: "Vue d'ensemble du projet",
  subtitle: "Découvrez Roof Garden dans son environnement naturel",
  imageSrc: "/images/project-overview.png",
  imageAlt: "Vue isométrique 3D du projet Roof Garden",
  features: [
    { label: "Accès Parking Souterrain" },
    { label: "Potager Partagé" },
    { label: "Espace Vélos" },
    { label: "Jardins Partagés" },
    { label: "Espace Végétalisé" },
  ],
  tabs: [
    { label: "Potager Partagé", icon: "trees" },
    { label: "Espace Vélos", icon: "bike" },
    { label: "Jardins Partagés", icon: "trees" },
    { label: "Parking Souterrain", icon: "parking" },
  ],
  ctaLabel: "Vue Vercors",
  ctaHref: "#galerie",
};

export const locationMapData = {
  sectionTitle: "Localisation privilégiée",
  subtitle: "Au cœur de Grenoble, entre ville et montagne",
  mapImageSrc: "/images/map-grenoble.png",
  mapImageAlt: "Carte de localisation du Roof Garden à Grenoble",
  projectBadge: "ROOF GARDEN",
  distanceStats: [
    { value: "2,5km", label: "Du centre historique" },
    { value: "800m", label: "Des commerces" },
    { value: "1,2km", label: "De la gare" },
  ],
};

export const connectivityData = {
  sectionTitle: "Connectivité optimale",
  transportOptions: [
    {
      title: "Transports en commun",
      description: "Ligne de tram A et B, réseau TAG complet",
    },
    {
      title: "Accès routier",
      description: "A480, rocade sud, parkings sécurisés",
    },
    {
      title: "Commodités",
      description: "Commerces, services, loisirs à pied",
    },
  ],
  ctaTitle: "Saisissez l'opportunité",
  ctaSubtitle: "Un rêve vous attend. Faites le premier pas.",
  partnerLogoSrc: "/images/greencity-logo.png",
  financingOptions: [
    {
      title: "TVA réduite à 5,5%",
      description: "Économie importante sur votre achat",
    },
    {
      title: "PTZ à Taux Zéro 2024",
      description: "Jusqu'à 0€ d'intérêts",
    },
    {
      title: "Frais Action Logement 1,5%",
      description: "Réduction significative des frais de notaire",
    },
  ],
};

export const contactData = {
  sectionTitle: "Contactez-nous",
  subtitle: "Remplissez vos informations personnelles",
  contactInfo: {
    phone: "04 76 XX XX XX",
    email: "contact@roofgarden-grenoble.fr",
    officeAddress: "123 Avenue de la République, 38000 Grenoble",
    whatsappUrl: "https://wa.me/33476000000",
  },
  pricingInfo: {
    lotsAvailable: 10,
    startingPrice: "182 500€",
    monthlyPayment: "490€/mois",
  },
  situationOptions: [
    { value: "primo", label: "Primo-accédant" },
    { value: "investisseur", label: "Investisseur" },
    { value: "residence-principale", label: "Résidence principale" },
    { value: "residence-secondaire", label: "Résidence secondaire" },
    { value: "autre", label: "Autre" },
  ],
};

export const footerData = {
  projectName: "Roof Garden",
  developerName: "GreenCity Immobilier",
  logoSrc: "/images/greencity-logo.png",
  phone: "04 76 XX XX XX",
  email: "contact@roofgarden-grenoble.fr",
  address: "123 Avenue de la République, 38000 Grenoble",
  legalLinks: [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Politique de confidentialité", href: "/politique-de-confidentialite" },
    { label: "CGU", href: "/cgu" },
  ],
};
