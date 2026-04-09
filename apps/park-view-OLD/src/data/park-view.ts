export const siteConfig = {
  projectName: "Park View 2",
  city: "Toulouse",
  developer: "GreenCity Immobilier & Sporting Promotion",
};

export const headerData = {
  projectLogoSrc: "/images/greencity-logo.png",
  projectLogoAlt: "Park View 2",
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
  backgroundImageSrc: "/images/Empalot_Park_View_Vue02_Web.jpg",
  partnerLogoSrc: "/images/greencity-logo.png",
  partnerLogoAlt: "GreenCity Immobilier & Sporting Promotion",
  headline: "Vivez au cœur du renouveau",
  highlightedText: "d'Empalot",
  subtitle:
    "Appartements T2 à T5 · Terrasses jusqu'à 80 m²\nUn cadre de vie durable au sud de Toulouse",
  locationBadge: "TOULOUSE",
  stats: [
    { value: "74", label: "Appartements" },
    { value: "T2-T5", label: "Du 2 au 5 pièces" },
    { value: "1", label: "Min du métro" },
  ],
  countdown: {
    targetDate: "2027-12-31",
    label: "Commercialisation en cours",
  },
  trustpilot: {
    rating: 5,
    reviewCount: 17000,
    label: "logements livrés par GreenCity",
  },
  primaryCta: { label: "Télécharger la brochure", href: "#contact" },
  secondaryCta: { label: "Découvrir les appartements", href: "#galerie" },
};

export const valuePropositionData = {
  sectionLabel: "Un programme d'exception à Toulouse",
  sectionTitle: "Park View 2, à l'écoute de",
  highlightedTitle: "son époque",
  subtitle:
    "Sporting Promotion et GreenCity Immobilier poursuivent leur ambition commune de concevoir des lieux de vie durables et accessibles, en phase avec les usages d'aujourd'hui et de demain.",
  items: [
    {
      title: "Un quartier en pleine renaissance",
      description:
        "Empalot bénéficie d'un ambitieux programme de renouvellement urbain, à deux pas de l'hypercentre de Toulouse",
    },
    {
      title: "Une construction durable et certifiée",
      description:
        "Certification NF Habitat HQE, conformité RE 2020 seuil 2025, démarche Effinature",
    },
    {
      title: "Des logements ouverts sur l'extérieur",
      description:
        "Tous les appartements disposent de loggias ou terrasses, jusqu'à 80 m² pour les T4 et T5",
    },
    {
      title: "Un investissement accessible et avantageux",
      description:
        "TVA réduite à 5,5%, dispositif Jeanbrun, LLI : plusieurs solutions pour devenir propriétaire ou investir",
    },
  ],
};

export const equipmentData = {
  sectionTitle: "Équipements et prestations",
  items: [
    { icon: "trees", label: "Cour paysagère", sublabel: "5 arbres plantés" },
    { icon: "shield", label: "Parking sécurisé", sublabel: "Sous-sol & RDC" },
    { icon: "bike", label: "Local vélos", sublabel: "Sécurisé en RDC" },
    { icon: "sun", label: "Terrasses & loggias", sublabel: "Jusqu'à 80 m²" },
    { icon: "zap", label: "Chauffage urbain", sublabel: "Réseau de chaleur" },
    { icon: "building", label: "Toiture végétalisée", sublabel: "Sur dalle" },
  ],
  ctaBanner: {
    message: "Un cadre de vie unique à Empalot",
    subtitle:
      "74 appartements du T2 au T5 dans un environnement naturel et urbain",
    actions: [
      { label: "Réserver ma visite", href: "#contact", variant: "default" as const },
      { label: "Télécharger la brochure", href: "#contact", variant: "outline" as const },
    ],
  },
};

export const testimonialsData = {
  sectionLabel: "Nos promoteurs",
  sectionTitle: "Portés par",
  highlightedTitle: "l'excellence",
  subtitle:
    "Deux promoteurs engagés qui poursuivent leur ambition commune de concevoir des lieux de vie durables et accessibles",
  testimonials: [
    {
      name: "GreenCity Immobilier",
      role: "4e promoteur indépendant français — 17 000+ logements livrés",
      quote:
        "GreenCity Immobilier se spécialise dans l'habitat résidentiel haut de gamme avec un engagement fort sur le confort et le bien-être des résidents, la construction durable avec des matériaux décarbonés et biosourcés, et la préservation de la biodiversité.",
      rating: 5,
    },
    {
      name: "Sporting Promotion",
      role: "Opérateur global depuis 1995 — 9 000+ logements réalisés",
      quote:
        "Depuis 1995, Sporting Promotion conçoit et développe des projets immobiliers adaptés aux nouveaux modes de vie. L'expérience de vie est au cœur de chaque projet : des espaces fonctionnels et conviviaux.",
      rating: 5,
    },
    {
      name: "Park View 2",
      role: "Certification NF Habitat HQE — RE 2020 seuil 2025",
      quote:
        "Park View 2 s'inscrit naturellement dans la continuité de Park View tout en affirmant sa propre identité, portée par les mêmes exigences de qualité architecturale, de performance environnementale et de responsabilité sociétale.",
      rating: 5,
    },
  ],
  stats: [
    { value: "3", label: "Pyramides d'Or nationales" },
    { value: "9 000+", label: "Logements Sporting Promotion" },
    { value: "28", label: "Pyramides FPI GreenCity" },
    { value: "17 000+", label: "Logements GreenCity" },
  ],
};

export const conversationsData = {
  sectionTitle: "Questions fréquentes",
  conversations: [
    {
      clientName: "Accession à prix maîtrisé",
      status: "TVA réduite 5,5%",
      messages: [
        {
          sender: "Question",
          message:
            "Comment fonctionne la TVA réduite à 5,5% sur Park View 2 ?",
          time: "",
          isAgent: false,
        },
        {
          sender: "Park View 2",
          message:
            "Certains logements Park View 2 sont éligibles à la TVA réduite à 5,5%, permettant d'acheter en dessous du prix du marché. Ce dispositif est réservé à l'occupation en résidence principale sous conditions de ressources et est cumulable avec le PTZ.",
          time: "",
          isAgent: true,
        },
      ],
    },
    {
      clientName: "Investissement locatif",
      status: "Dispositif LLI",
      messages: [
        {
          sender: "Question",
          message:
            "Quels sont les avantages du dispositif LLI pour investir à Park View 2 ?",
          time: "",
          isAgent: false,
        },
        {
          sender: "Park View 2",
          message:
            "Le Logement Locatif Intermédiaire (LLI) offre deux avantages : une remise immédiate de 10% sur le prix (TVA à 10% au lieu de 20%) et une exonération de taxe foncière pendant 20 ans. L'engagement de location est de 16 ans minimum avec des loyers plafonnés.",
          time: "",
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
      description: "Explorez les intérieurs lumineux et fonctionnels",
    },
    {
      icon: "tree",
      title: "Cour paysagère",
      description: "Découvrez le cœur vert de la résidence",
    },
    {
      icon: "mountain",
      title: "Terrasses",
      description: "Visualisez les espaces extérieurs jusqu'à 80 m²",
    },
  ],
  comingSoon: {
    title: "Visite virtuelle bientôt disponible",
    description:
      "Nous préparons une expérience immersive pour vous faire découvrir les appartements et espaces communs de Park View 2.",
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
      src: "/images/Empalot_Park_View_Interieur_Web.jpg",
      alt: "Intérieur lumineux d'un appartement Park View 2",
      tag: "Intérieur",
      title: "Intérieur contemporain",
      description:
        "Volumes fonctionnels et lumineux avec finitions de qualité dans un esprit contemporain",
    },
    {
      src: "/images/Empalot_Park_View_Terrasse_Web.jpg",
      alt: "Terrasse avec vue sur le quartier Empalot",
      tag: "Terrasse",
      title: "Terrasse spacieuse",
      description:
        "Profitez de terrasses généreuses jusqu'à 80 m² pour les grands appartements",
    },
    {
      src: "/images/Empalot_Park_View_Vue02_Web.jpg",
      alt: "Vue extérieure de la résidence Park View 2",
      tag: "Extérieur",
      title: "Architecture contemporaine",
      description:
        "Deux bâtiments aux lignes contemporaines dans un environnement naturel et apaisé",
    },
    {
      src: "/images/Empalot_Park_View_Vue18_Web.jpg",
      alt: "Vue d'ensemble de Park View 2",
      tag: "Résidence",
      title: "Vue d'ensemble",
      description:
        "Une résidence intégrée dans un secteur urbain en pleine évolution",
    },
    {
      src: "/images/Empalot_Park_View_Vue21_Web.jpg",
      alt: "Perspective de Park View 2 et ses abords",
      tag: "Environnement",
      title: "Cadre de vie",
      description:
        "Un cadre alliant vie citadine et qualité du quotidien",
    },
  ],
};

export const proximityData = {
  sectionTitle: "Tout à proximité",
  items: [
    { name: "Métro Empalot (Ligne B)", duration: "1 min", iconColor: "#3B82F6" },
    { name: "Médiathèque Empalot", duration: "1 min", iconColor: "#10B981" },
    { name: "Boulangerie", duration: "2 min", iconColor: "#F59E0B" },
    { name: "Marché de plein air", duration: "3 min", iconColor: "#8B5CF6" },
    { name: "Supermarché Lidl", duration: "5 min", iconColor: "#10B981" },
    { name: "Collège M. Berthelot", duration: "5 min vélo", iconColor: "#3B82F6" },
    { name: "Université Paul Sabatier", duration: "9 min vélo", iconColor: "#F59E0B" },
    { name: "Stadium TFC", duration: "4 min vélo", iconColor: "#EF4444" },
  ],
};

export const projectOverviewData = {
  sectionTitle: "Vue d'ensemble du projet",
  subtitle: "Découvrez Park View 2 dans son environnement urbain et naturel",
  imageSrc: "/images/Empalot_Park_View_Vue18_Web.jpg",
  imageAlt: "Vue d'ensemble du projet Park View 2 à Toulouse Empalot",
  features: [
    { label: "Parking souterrain sécurisé" },
    { label: "Cour paysagère (5 arbres)" },
    { label: "Local vélos sécurisé" },
    { label: "Toiture végétalisée" },
    { label: "Loggias & Terrasses" },
  ],
  tabs: [
    { label: "Cour paysagère", icon: "trees" },
    { label: "Local vélos", icon: "bike" },
    { label: "Toiture végétalisée", icon: "trees" },
    { label: "Parking souterrain", icon: "parking" },
  ],
  ctaLabel: "Voir la galerie",
  ctaHref: "#galerie",
};

export const locationMapData = {
  sectionTitle: "Localisation privilégiée",
  subtitle: "Au sud de Toulouse, au cœur du quartier Empalot en renouveau",
  mapImageSrc: "/images/Empalot_Park_View_Vue21_Web.jpg",
  mapImageAlt: "Localisation de Park View 2 à Toulouse Empalot",
  projectBadge: "PARK VIEW 2",
  distanceStats: [
    { value: "1 min", label: "Du métro Empalot" },
    { value: "3 stations", label: "Du centre-ville" },
    { value: "15 min", label: "De l'aéroport" },
  ],
};

export const connectivityData = {
  sectionTitle: "Connectivité optimale",
  transportOptions: [
    {
      title: "Métro & Bus",
      description: "Métro ligne B (1 min), bus lignes 44, 54, 152, Linéo L4",
    },
    {
      title: "Accès routier",
      description: "Autoroute A62 à 5 min, gare Matabiau à 13 min",
    },
    {
      title: "Mobilité douce",
      description: "Tramway Île du Ramier à 9 min vélo, pistes cyclables",
    },
  ],
  ctaTitle: "Saisissez l'opportunité",
  ctaSubtitle: "Un cadre de vie durable vous attend. Faites le premier pas.",
  partnerLogoSrc: "/images/greencity-logo.png",
  financingOptions: [
    {
      title: "TVA réduite à 5,5%",
      description: "Achetez en dessous du prix du marché, cumulable avec le PTZ",
    },
    {
      title: "Dispositif Jeanbrun",
      description: "Investissement locatif avec avantage fiscal sur l'amortissement",
    },
    {
      title: "LLI - Logement Intermédiaire",
      description: "10% de remise immédiate + exonération de taxe foncière 20 ans",
    },
  ],
};

export const contactData = {
  sectionTitle: "Contactez-nous",
  subtitle: "Remplissez vos informations personnelles",
  contactInfo: {
    phone: "05 82 08 26 31",
    email: "contact@sporting-promotion.fr",
    officeAddress: "Quartier Empalot, 31000 Toulouse",
    whatsappUrl: "https://wa.me/33582082631",
  },
  pricingInfo: {
    lotsAvailable: 74,
    startingPrice: "Sur demande",
    monthlyPayment: "Nous consulter",
  },
  situationOptions: [
    { value: "primo", label: "Primo-accédant" },
    { value: "investisseur", label: "Investisseur" },
    { value: "residence-principale", label: "Résidence principale" },
    { value: "tva-reduite", label: "TVA réduite 5,5%" },
    { value: "lli", label: "Investissement LLI" },
    { value: "jeanbrun", label: "Dispositif Jeanbrun" },
    { value: "autre", label: "Autre" },
  ],
};

export const footerData = {
  projectName: "Park View 2",
  developerName: "GreenCity Immobilier & Sporting Promotion",
  logoSrc: "/images/greencity-logo.png",
  phone: "05 82 08 26 31",
  email: "contact@sporting-promotion.fr",
  address: "Quartier Empalot, 31000 Toulouse",
  legalLinks: [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Politique de confidentialité", href: "/politique-de-confidentialite" },
    { label: "CGU", href: "/cgu" },
  ],
};
