export interface LegalData {
  // Identité de l'éditeur (mentions légales — LCEN art. 6)
  companyName: string;
  companyLegalForm?: string;
  companyCapital?: string;
  companyAddress: string;
  companyRcs?: string;
  companySiret?: string;
  companyVat?: string;
  companyPhone?: string;
  companyEmail: string;
  publicationDirector?: string;

  // Hébergeur (mentions légales obligatoires)
  hostingProvider?: string;
  hostingAddress?: string;
  hostingPhone?: string;

  // DPO / contact RGPD
  dpoName?: string;
  dpoEmail?: string;

  // Programme spécifique à l'app
  programName: string;
  projectAddress?: string;
}

// Affiche un placeholder visible quand une donnée légale n'est pas renseignée,
// pour que l'absence saute aux yeux du client en relecture.
export function legalValue(value: string | undefined, label: string): string {
  return value && value.trim() ? value : `[À compléter — ${label}]`;
}
