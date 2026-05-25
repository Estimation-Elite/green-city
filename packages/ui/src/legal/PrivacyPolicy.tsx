import * as React from "react";
import { type LegalData, legalValue } from "./legal-data";

type PrivacyPolicyProps = {
  data: LegalData;
};

export function PrivacyPolicy({ data }: PrivacyPolicyProps) {
  const controller = legalValue(data.companyName, "raison sociale");
  const controllerAddress = legalValue(
    data.companyAddress,
    "adresse du siège",
  );
  const dpoContact = data.dpoEmail
    ? data.dpoEmail
    : legalValue(data.companyEmail, "email de contact");

  return (
    <article className="prose prose-sm max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1>Politique de confidentialité</h1>
      <p>
        <em>Dernière mise à jour&nbsp;: 25 mai 2026.</em>
      </p>

      <p>
        La présente politique décrit la façon dont {controller} traite les
        données personnelles que vous nous transmettez via le site dédié au
        programme {legalValue(data.programName, "nom du programme")}, en
        conformité avec le Règlement (UE) 2016/679 (RGPD) et la loi
        Informatique et Libertés du 6 janvier 1978 modifiée.
      </p>

      <h2>1. Responsable du traitement</h2>
      <p>
        {controller}, dont le siège est situé {controllerAddress}, agit en
        qualité de responsable du traitement.
      </p>

      <h2>2. Données collectées</h2>
      <p>Les formulaires du site collectent&nbsp;:</p>
      <ul>
        <li>Identité&nbsp;: nom, prénom</li>
        <li>Coordonnées&nbsp;: email, numéro de téléphone</li>
        <li>
          Informations projet&nbsp;: objectif (résidence principale ou
          investissement), horizon d&apos;achat, situation de financement
        </li>
        <li>
          Préférences de visite&nbsp;: date et heure souhaitées pour un
          rendez-vous
        </li>
        <li>Message libre</li>
        <li>
          Données techniques liées au consentement&nbsp;: horodatage,
          version de la mention acceptée, adresse IP de soumission
        </li>
      </ul>

      <h2>3. Finalités et bases légales</h2>
      <ul>
        <li>
          <strong>Répondre à votre demande</strong> (information sur le
          programme, prise de rendez-vous, envoi de brochure)&nbsp;: base
          légale = consentement (art. 6.1.a RGPD)
        </li>
        <li>
          <strong>Suivi commercial</strong> par nos conseillers, y compris
          relances email/téléphone dans le cadre de votre projet
          immobilier&nbsp;: base légale = intérêt légitime (art. 6.1.f
          RGPD)
        </li>
        <li>
          <strong>Mesure d&apos;audience et amélioration du site</strong> via
          des outils d&apos;analyse, sous réserve de votre consentement
          préalable (bannière cookies)&nbsp;: base légale = consentement
          (art. 6.1.a RGPD)
        </li>
      </ul>

      <h2>4. Destinataires</h2>
      <p>
        Vos données sont accessibles aux équipes commerciales et marketing
        de {controller} et sont transmises aux sous-traitants suivants,
        chacun étant lié par un contrat conforme à l&apos;article 28 RGPD&nbsp;:
      </p>
      <ul>
        <li>
          <strong>GreenCity Immobilier (CRM iWit)</strong>&nbsp;: gestion
          de la relation prospect
        </li>
        <li>
          <strong>Brevo (Sendinblue SAS)</strong>&nbsp;: envoi d&apos;emails
          transactionnels et de campagnes
        </li>
        <li>
          <strong>Meta Platforms Ireland Ltd</strong>&nbsp;: uniquement
          lorsque vous remplissez un formulaire de publicité Facebook /
          Instagram Lead Ads
        </li>
        <li>
          <strong>Hébergeur</strong>&nbsp;:{" "}
          {legalValue(data.hostingProvider, "nom de l'hébergeur")}
        </li>
      </ul>
      <p>
        Aucune donnée n&apos;est transférée en dehors de l&apos;Union
        Européenne sans garanties appropriées (clauses contractuelles types
        de la Commission Européenne).
      </p>

      <h2>5. Durée de conservation</h2>
      <ul>
        <li>
          Prospects actifs&nbsp;: <strong>3 ans</strong> à compter du
          dernier contact de votre part (recommandation CNIL en prospection
          B2C)
        </li>
        <li>
          Prospects ayant exercé leur droit d&apos;opposition&nbsp;:
          archivage en base de suppression pendant <strong>3 ans</strong>
        </li>
        <li>
          Données nécessaires aux obligations comptables et fiscales (si
          contractualisation)&nbsp;: <strong>10 ans</strong>
        </li>
        <li>
          Logs techniques (consentement, cookies)&nbsp;:{" "}
          <strong>13 mois</strong>
        </li>
      </ul>

      <h2>6. Vos droits</h2>
      <p>
        Conformément aux articles 15 à 22 du RGPD, vous disposez à tout
        moment des droits suivants&nbsp;:
      </p>
      <ul>
        <li>Droit d&apos;accès à vos données</li>
        <li>Droit de rectification</li>
        <li>Droit à l&apos;effacement (droit à l&apos;oubli)</li>
        <li>Droit à la limitation du traitement</li>
        <li>Droit d&apos;opposition au traitement</li>
        <li>Droit à la portabilité de vos données</li>
        <li>
          Droit de retirer votre consentement à tout moment, sans que cela
          ne remette en cause la licéité du traitement antérieur
        </li>
      </ul>
      <p>
        Pour exercer ces droits, contactez-nous par email à&nbsp;:{" "}
        <a href={`mailto:${dpoContact}`}>{dpoContact}</a>
        {data.dpoName && (
          <>
            {" "}
            ({data.dpoName}, délégué à la protection des données)
          </>
        )}
        , ou par courrier à l&apos;adresse&nbsp;: {controllerAddress}.
      </p>
      <p>
        Une réponse vous sera apportée dans un délai d&apos;un mois. Vous
        disposez également du droit d&apos;introduire une réclamation auprès
        de la CNIL (
        <a
          href="https://www.cnil.fr/fr/plaintes"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.cnil.fr/fr/plaintes
        </a>
        ).
      </p>

      <h2>7. Sécurité</h2>
      <p>
        {controller} met en œuvre des mesures techniques et organisationnelles
        appropriées (chiffrement HTTPS, contrôle d&apos;accès, journalisation,
        sauvegardes) afin de protéger vos données contre la perte, le détournement
        ou l&apos;accès non autorisé.
      </p>

      <h2>8. Cookies</h2>
      <p>
        L&apos;utilisation des cookies et traceurs sur ce site est encadrée
        par notre <a href="/cookies">politique des cookies</a>, accessible à
        tout moment depuis le pied de page.
      </p>
    </article>
  );
}
