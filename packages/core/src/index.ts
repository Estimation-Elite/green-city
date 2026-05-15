export {
  createGreenCityLead,
  findGreenCityResidenceIdByName,
  type GreenCityLeadPayload,
  type GreenCityObjective,
  type PurchaseTime,
  type FinancingValidation,
  type LeadTemperature,
} from "./greencity-api";
export { normalizePhoneE164 } from "./phone";
export {
  mapObjective,
  mapPurchaseTime,
  mapFinancingValidation,
  computeTemperature,
} from "./api-routes";
export { addContactToBrevoList, type BrevoContactPayload } from "./brevo";
