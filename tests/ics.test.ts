import { describe, expect, it } from "vitest";
import { buildIcs, escapeIcsText } from "@/lib/ics";

describe("buildIcs", () => {
  const ics = buildIcs(
    {
      uid: "abc@nlight",
      start: new Date("2026-11-03T09:00:00Z"),
      end: new Date("2026-11-03T11:00:00Z"),
      summary: "Test de Profil Chromatique – NLIGHT",
      description: "Ligne 1\nLigne 2, avec virgule; et point-virgule",
      location: "1 rue des Pins, 33680 Lacanau",
    },
    new Date("2026-10-13T08:00:00Z"),
  );

  it("utilise des fins de ligne CRLF et les heures UTC", () => {
    expect(ics.includes("\r\n")).toBe(true);
    expect(ics.split("\r\n").every((line) => !line.includes("\n"))).toBe(true);
    expect(ics).toContain("DTSTART:20261103T090000Z");
    expect(ics).toContain("DTEND:20261103T110000Z");
    expect(ics).toContain("DTSTAMP:20261013T080000Z");
    expect(ics).toContain("UID:abc@nlight");
  });

  it("échappe les caractères spéciaux", () => {
    expect(escapeIcsText("a,b;c\\d\ne")).toBe("a\\,b\\;c\\\\d\\ne");
    expect(ics).toContain("DESCRIPTION:Ligne 1\\nLigne 2\\, avec virgule\\; et point-virgule");
  });

  it("plie les lignes trop longues à 75 octets", () => {
    const long = buildIcs({ uid: "x", start: new Date(0), end: new Date(60_000), summary: "é".repeat(80) });
    for (const line of long.split("\r\n")) expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
  });
});
