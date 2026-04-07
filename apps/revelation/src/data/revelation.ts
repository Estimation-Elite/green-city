export const siteConfig = {
  projectName: "Révélation",
  city: "Toulouse",
  developer: "GreenCity Immobilier",
};

export const headerData = {
  projectLogoSrc: "/images/greencity-logo.png",
  projectLogoAlt: "Révélation",
  navLinks: [
    { label: "Le projet", href: "#value-proposition" },
    { label: "Galerie", href: "#galerie" },
    { label: "Localisation", href: "#localisation" },
    { label: "Contact", href: "#contact" },
  ],
  ctaLabel: "Recevoir la brochure",
  ctaHref: "#contact",
};

export const heroData = {
  backgroundImageSrc: "/images/RteDeRevel_Vue09.jpg",
  partnerLogoSrc: "/images/greencity-logo.png",
  partnerLogoAlt: "GreenCity Immobilier",
  headline: "Révélez votre art de vivre à ",
  highlightedText: "Toulouse",
  subtitle:
    "168 appartements du T1 au T5 · Route de Revel\nArchitecture signée Benoît Jallon (LAN) · NF Habitat HQE",
  locationBadge: "TOULOUSE — FAUBOURG MALEPÈRE",
  stats: [
    { value: "168", label: "Appartements" },
    { value: "T1–T5", label: "Du studio au 5 pièces" },
    { value: "225", label: "Parkings souterrains" },
  ],
  countdown: {
    targetDate: "2028-12-31",
    label: "Lancement commercial en cours",
  },
  trustpilot: {
    rating: 5,
    reviewCount: 17000,
    label: "logements livrés par GreenCity",
  },
  primaryCta: { label: "Recevoir la brochure", href: "#contact" },
  secondaryCta: { label: "Découvrir le projet", href: "#value-proposition" },
};

export const valuePropositionData = {
  sectionLabel: "Un programme d'exception à Toulouse",
  sectionTitle: "Révélation, l'architecture au service de",
  highlightedTitle: "votre quotidien",
  subtitle:
    "Conçu par Benoît Jallon de LAN Architectures, Révélation conjugue excellence architecturale, engagement environnemental et emplacement stratégique au sud-est de Toulouse.",
  items: [
    {
      title: "Une signature architecturale prestigieuse",
      description:
        "Benoît Jallon (LAN Architectures), architecte de renommée internationale, signe un projet où chaque bâtiment dialogue avec la nature environnante",
    },
    {
      title: "Un quartier en plein essor",
      description:
        "Faubourg Malepère, éco-quartier au sud-est de Toulouse, à proximité immédiate de 2 stations de la future ligne C du métro",
    },
    {
      title: "Une construction durable et certifiée",
      description:
        "Certification NF Habitat HQE, conformité RE 2020, réseau de chaleur urbain et matériaux à faibles émissions pour un habitat responsable",
    },
    {
      title: "Des appartements connectés",
      description:
        "Domotique intégrée : pilotage du chauffage à distance, contrôle d'accès intelligent par QR code et badge, vidéosurveillance des parkings",
    },
  ],
};

export const equipmentData = {
  sectionTitle: "Équipements et prestations",
  items: [
    { icon: "wifi", label: "Appartements connectés", sublabel: "Domotique intégrée" },
    { icon: "shield", label: "Parkings sécurisés", sublabel: "225 places en sous-sol" },
    { icon: "bike", label: "Locaux vélos", sublabel: "Abris extérieurs et locaux fermés" },
    { icon: "trees", label: "Cœur vert paysager", sublabel: "Promenade centrale boisée" },
    { icon: "zap", label: "Performance énergétique", sublabel: "RE 2020 / NF HQE" },
    { icon: "sun", label: "Terrasses & balcons", sublabel: "Espaces extérieurs privatifs" },
  ],
  ctaBanner: {
    message: "168 appartements d'exception à Toulouse",
    subtitle:
      "Du T1 au T5, trouvez le logement qui vous correspond dans un cadre de vie unique",
    actions: [
      { label: "Demander les prix", href: "#contact", variant: "default" as const },
      { label: "Recevoir la brochure", href: "#contact", variant: "outline" as const },
    ],
  },
};

export const photoGalleryData = {
  sectionLabel: "Découvrez votre futur chez-vous",
  sectionTitle: "Galerie",
  highlightedTitle: "Photo",
  subtitle: "Explorez les espaces de vie conçus par LAN Architectures",
  photos: [
    {
      src: "/images/RteDeRevel_Vue09.jpg",
      alt: "Vue extérieure de la résidence Révélation",
      tag: "Extérieur",
      title: "Architecture contemporaine",
      description:
        "Des lignes épurées signées Benoît Jallon, intégrées dans un écrin de verdure",
    },
    {
      src: "/images/RteDeRevel_Rue.jpg",
      alt: "Vue depuis la rue de la résidence Révélation",
      tag: "Façade",
      title: "Insertion urbaine",
      description:
        "Façades claires inspirées de la brique rose toulousaine, volets bois ajourés",
    },
    {
      src: "/images/RteDeRevel_Ilot.jpg",
      alt: "Vue d'ensemble de l'îlot Révélation",
      tag: "Résidence",
      title: "Vue d'ensemble",
      description:
        "5 bâtiments collectifs articulés autour d'un espace vert central paysager",
    },
    {
      src: "/images/RtedeRevel_VueTerrasse.jpg",
      alt: "Vue depuis la terrasse d'un appartement Révélation",
      tag: "Terrasse",
      title: "Vue terrasse",
      description:
        "Profitez de terrasses avec plancher bois et vue dégagée sur le paysage",
    },
    {
      src: "/images/RtedeRevel_T4_A15_Int.jpg",
      alt: "Intérieur d'un T4 Révélation",
      tag: "Intérieur",
      title: "T4 lumineux — 88,90 m²",
      description:
        "Des espaces de vie généreux baignés de lumière naturelle, finitions soignées",
    },
  ],
};

export const proximityData = {
  sectionTitle: "Tout à proximité",
  items: [
    { name: "Métro Ligne C (2 stations)", duration: "À pied", iconColor: "#3B82F6" },
    { name: "Cité de l'Espace", duration: "3 km", iconColor: "#8B5CF6" },
    { name: "Toulouse Aerospace / Airbus DS", duration: "2 km", iconColor: "#3B82F6" },
    { name: "Centre commercial Labège-Innopole", duration: "3,5 km", iconColor: "#10B981" },
    { name: "Université Paul Sabatier", duration: "4,5 km", iconColor: "#F59E0B" },
    { name: "Parc de la Marcaissonne", duration: "À pied", iconColor: "#10B981" },
    { name: "Place du Capitole (centre-ville)", duration: "7 km", iconColor: "#EF4444" },
    { name: "Autoroute A61 (sortie 18)", duration: "Immédiat", iconColor: "#6B7280" },
  ],
};

export const projectOverviewData = {
  sectionTitle: "Vue d'ensemble du projet",
  subtitle:
    "Découvrez Révélation, 5 bâtiments du R+2 au R+7 dans un écrin de nature à Faubourg Malepère",
  imageSrc: "/images/RtedeRevel_Masse.jpg",
  imageAlt: "Vue d'ensemble du projet Révélation à Toulouse",
  features: [
    { label: "225 parkings souterrains sur 2 niveaux" },
    { label: "Promenade paysagère centrale" },
    { label: "Locaux vélos sécurisés" },
    { label: "Terrasses et balcons privatifs" },
    { label: "Façades claires, volets bois" },
  ],
  tabs: [
    { label: "Cœur vert", icon: "trees" },
    { label: "Local vélos", icon: "bike" },
    { label: "Promenade", icon: "trees" },
    { label: "Parking souterrain", icon: "parking" },
  ],
  ctaLabel: "Voir la galerie",
  ctaHref: "#galerie",
};

export const locationMapData = {
  sectionTitle: "Localisation privilégiée",
  subtitle:
    "Au sud-est de Toulouse, dans l'éco-quartier Faubourg Malepère, à deux pas de la future ligne C du métro",
  mapImageSrc: "/images/RteDeRevel_Ilot.jpg",
  mapImageAlt: "Localisation de Révélation à Toulouse Faubourg Malepère",
  projectBadge: "RÉVÉLATION",
  distanceStats: [
    { value: "7 km", label: "Du centre-ville" },
    { value: "2 stations", label: "Métro Ligne C" },
    { value: "20 km", label: "De l'aéroport" },
  ],
};

export const connectivityData = {
  sectionTitle: "Connectivité optimale",
  transportOptions: [
    {
      title: "Métro Ligne C",
      description:
        "2 stations à proximité : Montaudran Piste des Géants et Montaudran Innovation Campus",
    },
    {
      title: "Accès routier",
      description:
        "Autoroute A61 sortie 18 (Montaudran) en accès immédiat, gare Matabiau à 7,5 km",
    },
    {
      title: "Mobilité douce",
      description:
        "Pistes cyclables traversant le Bois de l'Hers, téléphérique urbain TELEO",
    },
  ],
  ctaTitle: "Saisissez l'opportunité",
  ctaSubtitle:
    "Un cadre de vie d'exception à Toulouse. Faites le premier pas vers votre nouveau chez-vous.",
  partnerLogoSrc: "/images/greencity-logo.png",
  financingOptions: [
    {
      title: "Résidence principale",
      description:
        "Devenez propriétaire dans un quartier en plein essor avec un fort potentiel de valorisation",
    },
    {
      title: "Investissement locatif",
      description:
        "Bassin de 30 000+ emplois (aéronautique, médical, tech) à proximité immédiate",
    },
    {
      title: "Dispositifs avantageux",
      description:
        "PTZ, Pinel, LLI : plusieurs solutions de financement selon votre profil",
    },
  ],
};

export const contactData = {
  sectionTitle: "Contactez-nous",
  subtitle: "Remplissez vos informations pour recevoir la brochure complète",
  contactInfo: {
    phone: "05 34 61 30 60",
    email: "contact@greencityimmobilier.fr",
    officeAddress: "13 Rue Paul Mesplé, 31100 Toulouse",
  },
  pricingInfo: {
    lotsAvailable: 168,
    startingPrice: "Sur demande",
    monthlyPayment: "Nous consulter",
  },
  situationOptions: [
    { value: "primo", label: "Primo-accédant" },
    { value: "investisseur", label: "Investisseur" },
    { value: "residence-principale", label: "Résidence principale" },
    { value: "pinel", label: "Dispositif Pinel" },
    { value: "lli", label: "Investissement LLI" },
    { value: "autre", label: "Autre" },
  ],
};

export const footerData = {
  projectName: "Révélation",
  developerName: "GreenCity Immobilier",
  logoSrc: "/images/greencity-logo.png",
  phone: "05 34 61 30 60",
  email: "contact@greencityimmobilier.fr",
  address: "13 Rue Paul Mesplé, 31100 Toulouse",
  legalLinks: [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Politique de confidentialité", href: "/politique-de-confidentialite" },
    { label: "CGU", href: "/cgu" },
  ],
};
