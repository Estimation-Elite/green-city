import * as React from "react";
import { PRIVACY_POLICY_PATH } from "./consent-text";

type ConsentLabelProps = {
  className?: string;
};

export function ConsentLabel({ className }: ConsentLabelProps) {
  return (
    <span className={className}>
      J&apos;accepte que mes données soient traitées dans le cadre de ma
      demande. Consultez notre{" "}
      <a
        href={PRIVACY_POLICY_PATH}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:opacity-80"
      >
        politique de confidentialité
      </a>{" "}
      pour en savoir plus.
    </span>
  );
}
