import Link from "next/link";
import {
  fetchGreenCityLeads,
  type GreenCityLead,
  type GreenCityLeadState,
} from "@repo/core/greencity-api";
import { ConsoleNavigation } from "@/components/ConsoleNavigation";

export const dynamic = "force-dynamic";

const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

const stateLabels: Record<GreenCityLeadState, string> = {
  NEW: "Nouveau",
  DISCOVERY_CALL: "Appel decouverte",
  APPOINTMENT: "Rendez-vous",
  RESERVATION: "Reservation",
  ACTED: "Acte",
  LOST: "Perdu",
};

const stateClasses: Record<GreenCityLeadState, string> = {
  NEW: "bg-sky-100 text-sky-800 ring-sky-200",
  DISCOVERY_CALL: "bg-indigo-100 text-indigo-800 ring-indigo-200",
  APPOINTMENT: "bg-amber-100 text-amber-900 ring-amber-200",
  RESERVATION: "bg-emerald-100 text-emerald-900 ring-emerald-200",
  ACTED: "bg-teal-100 text-teal-900 ring-teal-200",
  LOST: "bg-rose-100 text-rose-800 ring-rose-200",
};

type PageProps = {
  searchParams: Promise<{
    page?: string | string[];
    limit?: string | string[];
  }>;
};

function readNumber(
  value: string | string[] | undefined,
  fallback: number,
): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function buildPageHref(page: number, limit: number) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return `/?${params.toString()}`;
}

function formatOptionalValue(value?: string | null) {
  return value || "Non renseigne";
}

function LeadStateBadge({ state }: { state: GreenCityLeadState }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${stateClasses[state]}`}
    >
      {stateLabels[state]}
    </span>
  );
}

export default async function LeadsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = readNumber(params.page, 1);
  const requestedLimit = readNumber(params.limit, DEFAULT_LIMIT);
  const limit = Math.min(requestedLimit, MAX_LIMIT);
  const offset = (page - 1) * limit;

  try {
    const leads = await fetchGreenCityLeads({ offset, limit });
    const currentPage = Math.floor(leads.offset / leads.limit) + 1;
    const totalPages = Math.max(1, Math.ceil(leads.total / leads.limit));
    const from = leads.total === 0 ? 0 : leads.offset + 1;
    const to = Math.min(leads.offset + leads.data.length, leads.total);

    return (
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[32px] bg-primary text-white shadow-[0_36px_120px_rgba(16,39,63,0.24)]">
          <div className="flex flex-col gap-6 px-6 py-8 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/65">
                GreenCity Console
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Leads GreenCity
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/78 sm:text-base">
                Application dediee a la consultation des leads remontes par
                `GET /api/lead`.
              </p>
              <div className="mt-5">
                <ConsoleNavigation currentPage="leads" />
              </div>
            </div>
            <div className="grid min-w-[240px] gap-3 rounded-[28px] border border-white/12 bg-white/8 p-5 backdrop-blur-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Total leads
                </p>
                <p className="mt-1 text-3xl font-bold">{leads.total}</p>
              </div>
              <div className="flex gap-3 text-sm text-white/80">
                <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1">
                  offset {leads.offset}
                </span>
                <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1">
                  limit {leads.limit}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] bg-white/90 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur-sm">
            <p className="text-sm text-muted">Pagination</p>
            <p className="mt-2 text-2xl font-bold text-primary">
              Page {currentPage} / {totalPages}
            </p>
          </div>
          <div className="rounded-[28px] bg-white/90 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur-sm">
            <p className="text-sm text-muted">Elements affiches</p>
            <p className="mt-2 text-2xl font-bold text-primary">
              {from} - {to}
            </p>
          </div>
          <div className="rounded-[28px] bg-white/90 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur-sm">
            <p className="text-sm text-muted">Taille de page</p>
            <p className="mt-2 text-2xl font-bold text-primary">
              {leads.limit}
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-[28px] bg-white/92 shadow-sm ring-1 ring-black/5 backdrop-blur-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-primary">Leads</h2>
              <p className="mt-1 text-sm text-muted">
                Prenom, nom, emails, telephones, etat CRM et raison de perte.
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-500">
                Date d&apos;ajout indisponible: ce champ n&apos;est pas renvoye
                par `GET /api/lead`.
              </p>
            </div>
          </div>

          {leads.data.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-lg font-semibold text-primary">
                Aucun lead disponible
              </p>
              <p className="mt-2 text-sm text-muted">
                L&apos;API a repondu correctement mais n&apos;a retourne aucun
                element pour cette page.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50/90">
                  <tr className="text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    <th className="px-6 py-4">Prenom</th>
                    <th className="px-6 py-4">Nom</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Mobile</th>
                    <th className="px-6 py-4">Fixe</th>
                    <th className="px-6 py-4">Etat</th>
                    <th className="px-6 py-4">Raison de perte</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white/80">
                  {leads.data.map((lead, index) => (
                    <tr key={`${lead.email}-${lead.state}-${index}`}>
                      <td className="px-6 py-4 align-top text-sm font-medium text-slate-900">
                        {lead.firstName}
                      </td>
                      <td className="px-6 py-4 align-top text-sm font-medium text-slate-900">
                        {lead.lastName}
                      </td>
                      <td className="px-6 py-4 align-top text-sm text-slate-700">
                        <a
                          href={`mailto:${lead.email}`}
                          className="underline decoration-slate-300 underline-offset-4 transition hover:text-primary"
                        >
                          {lead.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 align-top text-sm text-slate-700">
                        {formatOptionalValue(lead.phoneMobile)}
                      </td>
                      <td className="px-6 py-4 align-top text-sm text-slate-700">
                        {formatOptionalValue(lead.phoneLandline)}
                      </td>
                      <td className="px-6 py-4 align-top">
                        <LeadStateBadge state={lead.state} />
                      </td>
                      <td className="px-6 py-4 align-top text-sm text-slate-700">
                        {lead.lostReason || "Non applicable"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              Pagination basee sur `offset` et `limit`.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href={buildPageHref(1, leads.limit)}
                aria-disabled={currentPage <= 1}
                className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition ${
                  currentPage <= 1
                    ? "pointer-events-none bg-slate-100 text-slate-400"
                    : "border border-slate-200 bg-white text-primary hover:bg-slate-50"
                }`}
              >
                Premiere page
              </Link>
              <Link
                href={buildPageHref(Math.max(currentPage - 1, 1), leads.limit)}
                aria-disabled={currentPage <= 1}
                className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition ${
                  currentPage <= 1
                    ? "pointer-events-none bg-slate-100 text-slate-400"
                    : "bg-primary text-white hover:bg-primary-dark"
                }`}
              >
                Page precedente
              </Link>
              <Link
                href={buildPageHref(
                  Math.min(currentPage + 1, totalPages),
                  leads.limit,
                )}
                aria-disabled={currentPage >= totalPages}
                className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition ${
                  currentPage >= totalPages
                    ? "pointer-events-none bg-slate-100 text-slate-400"
                    : "bg-accent text-primary hover:bg-accent-dark"
                }`}
              >
                Page suivante
              </Link>
              <Link
                href={buildPageHref(totalPages, leads.limit)}
                aria-disabled={currentPage >= totalPages}
                className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition ${
                  currentPage >= totalPages
                    ? "pointer-events-none bg-slate-100 text-slate-400"
                    : "border border-slate-200 bg-white text-primary hover:bg-slate-50"
                }`}
              >
                Derniere page
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erreur inconnue lors du chargement des leads.";

    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full rounded-[32px] border border-rose-200 bg-white/92 p-8 shadow-sm ring-1 ring-black/5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-700">
            Echec du chargement
          </p>
          <h1 className="mt-3 text-3xl font-bold text-primary">
            Impossible de recuperer les leads
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-700 sm:text-base">
            Verifie `GREENCITY_API_URL`, `GREENCITY_API_KEY`,
            `GREENCITY_API_SECRET` et, si activees, `LEADS_BASIC_AUTH_USER` /
            `LEADS_BASIC_AUTH_PASSWORD`.
          </p>
          <pre className="mt-6 overflow-x-auto rounded-2xl bg-slate-950/95 p-4 text-sm text-slate-100">
            {message}
          </pre>
        </div>
      </main>
    );
  }
}
