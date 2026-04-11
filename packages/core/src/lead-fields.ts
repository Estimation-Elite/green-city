export interface LeadFieldsInput {
  leadId?: string;
  name: string;
  email: string;
  phone: string;
  situation?: string;
  message?: string;
  utmSource?: string;
  site?: string;
  objectif?: string;
  purchaseTime?: string;
  financingValidation?: string;
  appointmentDate?: string;
}

export function buildLeadFields(
  input: LeadFieldsInput,
  source: string,
): Record<string, string | undefined> {
  const fields: Record<string, string | undefined> = {
    "Lead ID": input.leadId,
    "Nom & Prénom": input.name,
    Email: input.email,
    Tel: input.phone,
    Source: source,
  };

  if (input.situation) fields["Situation"] = input.situation;
  if (input.message) fields["Message"] = input.message;
  if (input.utmSource) fields["UTM Source"] = input.utmSource;
  if (input.site) fields["Site"] = input.site;
  if (input.objectif) fields["Objectif"] = input.objectif;
  if (input.purchaseTime) fields["Horizon d'achat"] = input.purchaseTime;
  if (input.financingValidation) fields["Financement validé"] = input.financingValidation;
  if (input.appointmentDate) fields["Date RDV Téléphonique"] = input.appointmentDate;

  return fields;
}
