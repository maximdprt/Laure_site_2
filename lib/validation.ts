import { z } from "zod";

/**
 * Schémas de validation partagés client / serveur.
 * Les messages d'erreur sont des clés traduites dans messages/*.json (forms.errors.*).
 */

const required = (max = 200) => z.string().trim().min(1, "required").max(max, "tooLong");
const email = z.string().trim().min(1, "required").max(254, "tooLong").pipe(z.email("email"));
const phone = z
  .string()
  .trim()
  .min(1, "required")
  .max(30, "tooLong")
  .regex(/^[+()\d\s.-]{6,}$/, "phone");
const optionalPhone = z
  .string()
  .trim()
  .max(30, "tooLong")
  .refine((v) => v === "" || /^[+()\d\s.-]{6,}$/.test(v), "phone");
const consent = z.boolean().refine((v) => v, "consent");
/** Champ piège anti-spam : doit rester vide */
const honeypot = z.string().max(0).optional();
const locale = z.enum(["fr", "en"]);

export const MESSAGE_MAX = 500;

export const newsletterSchema = z.object({
  email,
  firstName: z.string().trim().max(80, "tooLong"),
  consent,
  website: honeypot,
  locale,
});
export type NewsletterInput = z.infer<typeof newsletterSchema>;

export const contactSubjects = ["question", "preparation", "shop", "other"] as const;

export const contactSchema = z.object({
  name: required(120),
  email,
  phone: optionalPhone,
  subject: z.enum(contactSubjects),
  message: z.string().trim().min(10, "tooShort").max(3000, "tooLong"),
  consent,
  website: honeypot,
  locale,
});
export type ContactInput = z.infer<typeof contactSchema>;

export const bookingSchema = z
  .object({
    serviceId: z.enum(["decouverte", "test", "pack", "suivi"]),
    format: z.enum(["cabinet", "distance", "telephone"]),
    /** Début du créneau, ISO 8601 UTC */
    start: z.iso.datetime(),
    firstName: required(80),
    lastName: required(80),
    email,
    phone,
    addressLine: z.string().trim().max(200, "tooLong"),
    postalCode: z.string().trim().max(12, "tooLong"),
    city: z.string().trim().max(100, "tooLong"),
    message: z.string().trim().max(MESSAGE_MAX, "tooLong"),
    terms: z.boolean().refine((v) => v, "terms"),
    consent,
    website: honeypot,
    locale,
  })
  .superRefine((data, ctx) => {
    const needsAddress = data.format === "distance" && (data.serviceId === "test" || data.serviceId === "pack");
    if (!needsAddress) return;
    if (!data.addressLine) ctx.addIssue({ code: "custom", path: ["addressLine"], message: "required" });
    if (!data.postalCode) ctx.addIssue({ code: "custom", path: ["postalCode"], message: "required" });
    if (!data.city) ctx.addIssue({ code: "custom", path: ["city"], message: "required" });
  });
export type BookingInput = z.infer<typeof bookingSchema>;

export const shopCheckoutSchema = z.object({
  lines: z
    .array(z.object({ slug: z.string().min(1).max(80), quantity: z.number().int().min(1).max(10) }))
    .min(1)
    .max(20),
  locale,
});
export type ShopCheckoutInput = z.infer<typeof shopCheckoutSchema>;
