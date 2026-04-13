import {
  fetchGreenCityResidences,
  type GreenCityResidence,
} from "@repo/core/greencity-api";
import { ConsoleNavigation } from "@/components/ConsoleNavigation";

export const dynamic = "force-dynamic";

function formatResidenceId(residence: GreenCityResidence) {
  return `#${residence.id}`;
}

export default async function ResidencesPage() {
  try {
    const residences = await fetchGreenCityResidences();

    return (
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[32px] bg-primary text-white shadow-[0_36px_120px_rgba(16,39,63,0.24)]">
          <div className="flex flex-col gap-6 px-6 py-8 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/65">
                GreenCity Console
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Residences GreenCity
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/78 sm:text-base">
                Liste des residences retournees par `GET
                /api/lead/residences`.
              </p>
              <div className="mt-5">
                <ConsoleNavigation currentPage="residences" />
              </div>
            </div>
            <div className="grid min-w-[240px] gap-3 rounded-[28px] border border-white/12 bg-white/8 p-5 backdrop-blur-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Total residences
                </p>
                <p className="mt-1 text-3xl font-bold">{residences.length}</p>
              </div>
              <p className="text-sm leading-6 text-white/78">
                Ces identifiants peuvent etre reutilises lors de la creation de
                leads via le champ `residences`.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] bg-white/90 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur-sm">
            <p className="text-sm text-muted">Premier ID</p>
            <p className="mt-2 text-2xl font-bold text-primary">
              {residences[0]?.id ?? "-"}
            </p>
          </div>
          <div className="rounded-[28px] bg-white/90 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur-sm">
            <p className="text-sm text-muted">Dernier ID</p>
            <p className="mt-2 text-2xl font-bold text-primary">
              {residences.at(-1)?.id ?? "-"}
            </p>
          </div>
          <div className="rounded-[28px] bg-white/90 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur-sm">
            <p className="text-sm text-muted">Format</p>
            <p className="mt-2 text-2xl font-bold text-primary">id + nom</p>
          </div>
        </section>

        <section className="overflow-hidden rounded-[28px] bg-white/92 shadow-sm ring-1 ring-black/5 backdrop-blur-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-primary">Residences</h2>
              <p className="mt-1 text-sm text-muted">
                Identifiant technique et nom de residence exposes par l&apos;API.
              </p>
            </div>
          </div>

          {residences.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-lg font-semibold text-primary">
                Aucune residence disponible
              </p>
              <p className="mt-2 text-sm text-muted">
                L&apos;API a repondu correctement mais n&apos;a retourne aucun
                element.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-3">
              {residences.map((residence) => (
                <article
                  key={residence.id}
                  className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    Residence
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-primary">
                    {residence.name}
                  </h3>
                  <p className="mt-4 inline-flex rounded-full bg-primary-light px-3 py-1 text-sm font-semibold text-primary">
                    {formatResidenceId(residence)}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erreur inconnue lors du chargement des residences.";

    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full rounded-[32px] border border-rose-200 bg-white/92 p-8 shadow-sm ring-1 ring-black/5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-700">
            Echec du chargement
          </p>
          <h1 className="mt-3 text-3xl font-bold text-primary">
            Impossible de recuperer les residences
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
