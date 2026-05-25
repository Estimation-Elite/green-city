import * as React from "react";
import { type LegalData, legalValue } from "./legal-data";

type CookiePolicyProps = {
  data: LegalData;
};

export function CookiePolicy({ data }: CookiePolicyProps) {
  const controller = legalValue(data.companyName, "raison sociale");
  return (
    <article className="prose prose-sm max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1>Politique des cookies</h1>
      <p>
        <em>Dernière mise à jour&nbsp;: 25 mai 2026.</em>
      </p>

      <h2>Qu&apos;est-ce qu&apos;un cookie&nbsp;?</h2>
      <p>
        Un cookie est un petit fichier déposé sur votre terminal lors de la
        consultation d&apos;un site. Il permet, pendant sa durée de validité,
        de reconnaître votre navigateur, de mémoriser vos préférences et de
        mesurer la fréquentation.
      </p>

      <h2>Cookies utilisés sur ce site</h2>

      <h3>Cookies strictement nécessaires</h3>
      <p>
        Ces cookies sont indispensables au fonctionnement du site (mémorisation
        de votre choix de consentement, sécurisation des formulaires). Ils ne
        nécessitent pas votre consentement.
      </p>
      <ul>
        <li>
          <code>gc_consent</code>&nbsp;: mémorise vos choix de consentement
          aux cookies (durée&nbsp;: 12 mois)
        </li>
      </ul>

      <h3>Cookies de mesure d&apos;audience et marketing</h3>
      <p>
        Ces cookies sont déposés uniquement si vous y consentez via la
        bannière affichée à votre première visite. Vous pouvez à tout moment
        modifier votre choix en cliquant sur le lien «&nbsp;Gérer mes
        cookies&nbsp;» en pied de page.
      </p>
      <ul>
        <li>
          <strong>Google Analytics / Google Tag Manager</strong>&nbsp;: mesure
          d&apos;audience anonymisée, durée 13 mois maximum
        </li>
        <li>
          <strong>Meta Pixel (Facebook)</strong>&nbsp;: mesure de
          l&apos;efficacité des campagnes publicitaires et constitution
          d&apos;audiences similaires, durée 13 mois maximum
        </li>
        <li>
          <strong>Google Ads</strong>&nbsp;: suivi des conversions
          publicitaires, durée 13 mois maximum
        </li>
      </ul>

      <h2>Gérer vos choix</h2>
      <p>
        Vous pouvez à tout moment modifier votre consentement&nbsp;:
      </p>
      <ul>
        <li>
          en cliquant sur le lien «&nbsp;Gérer mes cookies&nbsp;» en pied de
          page
        </li>
        <li>
          en paramétrant votre navigateur pour refuser les cookies&nbsp;:
          <ul>
            <li>
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Chrome
              </a>
            </li>
            <li>
              <a
                href="https://support.mozilla.org/fr/kb/protection-renforcee-contre-pistage-firefox-ordinateur"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a
                href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
              >
                Safari
              </a>
            </li>
            <li>
              <a
                href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                target="_blank"
                rel="noopener noreferrer"
              >
                Microsoft Edge
              </a>
            </li>
          </ul>
        </li>
      </ul>

      <h2>Contact</h2>
      <p>
        Pour toute question relative à l&apos;utilisation des cookies, vous
        pouvez contacter {controller} à l&apos;adresse{" "}
        <a href={`mailto:${data.companyEmail}`}>
          {legalValue(data.companyEmail, "email de contact")}
        </a>
        .
      </p>
    </article>
  );
}
