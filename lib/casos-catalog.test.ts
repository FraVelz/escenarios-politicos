import { describe, expect, it } from "vitest";
import { isBlacklistedTitle, matchCasoCatalog } from "./casos-catalog";

describe("casos-catalog", () => {
  it("empareja frases largas", () => {
    const hit = matchCasoCatalog("El gobierno anuncia plan de empleo formal");
    expect(hit?.id).toBe("empleo-con-plan");
  });

  it("no inventa con keyword corta genérica", () => {
    expect(matchCasoCatalog("noticias de hoy")).toBeNull();
  });

  it("blacklist títulos cortos", () => {
    expect(isBlacklistedTitle("Opinión")).toBe(true);
    expect(isBlacklistedTitle("Reforma fiscal en el Congreso hoy")).toBe(false);
  });
});
