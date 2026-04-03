export interface LeadFieldsInput {
  leadId?: string;
  name: string;
  email: string;
  phone: string;
  situation?: string;
  message?: string;
  utmSource?: string;
  site?: string;
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

  return fields;
}
