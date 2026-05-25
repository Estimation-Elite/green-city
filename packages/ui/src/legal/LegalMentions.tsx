import * as React from "react";
import { type LegalData, legalValue } from "./legal-data";

type LegalMentionsProps = {
  data: LegalData;
};

export function LegalMentions({ data }: LegalMentionsProps) {
  return (
    <article className="prose prose-sm max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1>Mentions légales</h1>

      <h2>Éditeur du site</h2>
      <p>
        <strong>{legalValue(data.companyName, "raison sociale")}</strong>
        {data.companyLegalForm ? `, ${data.companyLegalForm}` : ""}
        {data.companyCapital ? ` au capital de ${data.companyCapital}` : ""}.
      </p>
      <p>
        Siège social&nbsp;: {legalValue(data.companyAddress, "adresse du siège")}
        <br />
        RCS&nbsp;: {legalValue(data.companyRcs, "numéro RCS")}
        <br />
        SIRET&nbsp;: {legalValue(data.companySiret, "SIRET")}
        <br />
        TVA intracommunautaire&nbsp;:{" "}
        {legalValue(data.companyVat, "numéro de TVA")}
      </p>
      {data.companyPhone && <p>Téléphone&nbsp;: {data.companyPhone}</p>}
      <p>
        Email&nbsp;: {legalValue(data.companyEmail, "email de contact")}
      </p>
      <p>
        Directeur de la publication&nbsp;:{" "}
        {legalValue(data.publicationDirector, "directeur de la publication")}
      </p>

      <h2>Hébergeur</h2>
      <p>
        {legalValue(data.hostingProvider, "nom de l'hébergeur")}
        <br />
        {data.hostingAddress}
        {data.hostingPhone && (
          <>
            <br />
            Téléphone&nbsp;: {data.hostingPhone}
          </>
        )}
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus de ce site (textes, images, vidéos,
        plans, logos, marques) est protégé par le droit d&apos;auteur et reste
        la propriété exclusive de {legalValue(data.companyName, "raison sociale")}{" "}
        ou de ses partenaires. Toute reproduction, représentation, adaptation
        ou exploitation, totale ou partielle, est interdite sans autorisation
        écrite préalable.
      </p>

      <h2>Illustrations</h2>
      <p>
        Les illustrations, perspectives et plans présentés sur ce site sont
        non contractuels et donnés à titre indicatif. Les caractéristiques
        définitives du programme {legalValue(data.programName, "nom du programme")}{" "}
        sont celles décrites dans les contrats de réservation et de vente.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Les modalités de traitement des données personnelles collectées sur
        ce site sont décrites dans notre{" "}
        <a href="/politique-de-confidentialite">politique de confidentialité</a>.
      </p>

      <h2>Cookies</h2>
      <p>
        L&apos;utilisation des cookies est détaillée dans notre{" "}
        <a href="/cookies">politique des cookies</a>.
      </p>
    </article>
  );
}
