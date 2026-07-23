import { describe, expect, it } from "vitest";
import {
  countryPath,
  isCountryAvailableSync,
  listAvailableCountriesSync,
  seedCountryIdsWithData,
} from "./countries";
import { listInstitucionesSync, listPartidosSync, listCasosSync } from "./data";

describe("countries", () => {
  it("solo lista países con datos (co)", () => {
    const avail = listAvailableCountriesSync();
    expect(avail.map((p) => p.id)).toEqual(["co"]);
    expect(isCountryAvailableSync("co")).toBe(true);
    expect(isCountryAvailableSync("mx")).toBe(false);
  });

  it("seedCountryIdsWithData incluye co", () => {
    expect(seedCountryIdsWithData().has("co")).toBe(true);
  });

  it("countryPath construye rutas", () => {
    expect(countryPath("co")).toBe("/co");
    expect(countryPath("co", "/casos")).toBe("/co/casos");
  });
});

describe("data country filter", () => {
  it("filtra casos e instituciones por country_id", () => {
    expect(listCasosSync("co").length).toBeGreaterThan(0);
    expect(listCasosSync("mx")).toHaveLength(0);
    expect(listInstitucionesSync("co").length).toBe(7);
    expect(listPartidosSync("co").length).toBeGreaterThan(0);
  });
});
