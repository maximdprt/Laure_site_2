"use client";

import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";

/** Démonstration des champs à filet (aucun envoi) */
export function StyleguideForm() {
  return (
    <form className="grid max-w-3xl gap-8 md:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
      <Field label="Prénom">{({ id }) => <Input id={id} placeholder="Laure" />}</Field>
      <Field label="E-mail" error="Merci d'indiquer une adresse e-mail valide.">
        {({ id, describedBy, invalid }) => (
          <Input id={id} type="email" aria-invalid={invalid} aria-describedby={describedBy} defaultValue="laure@" />
        )}
      </Field>
      <Field label="Sujet">
        {({ id }) => (
          <Select id={id}>
            <option>Question</option>
            <option>Préparation</option>
          </Select>
        )}
      </Field>
      <Field label="Message" optional help="500 caractères maximum." className="md:col-span-2">
        {({ id, describedBy }) => <Textarea id={id} aria-describedby={describedBy} />}
      </Field>
      <Checkbox label="J'accepte la politique de confidentialité." className="md:col-span-2" />
    </form>
  );
}
