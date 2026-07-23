import { describe, expect, it } from "vitest";
import { parseFeedItems } from "./rss-parse";

describe("parseFeedItems", () => {
  it("parsea RSS item básico", () => {
    const xml = `<?xml version="1.0"?>
<rss><channel>
<item>
<title>Reforma fiscal avanza en el Congreso</title>
<link>https://www.elespectador.com/politica/reforma-fiscal-x</link>
<pubDate>Tue, 21 Jul 2026 10:00:00 GMT</pubDate>
<description>Detalle del plan</description>
</item>
</channel></rss>`;
    const items = parseFeedItems(xml);
    expect(items).toHaveLength(1);
    expect(items[0]!.title).toContain("Reforma fiscal");
    expect(items[0]!.link).toContain("elespectador.com");
  });

  it("parsea Atom entry", () => {
    const xml = `<?xml version="1.0"?>
<feed>
<entry>
<title>Seguridad rural en debate</title>
<link href="https://www.lasillavacia.com/historia/x"/>
<published>2026-07-21T10:00:00Z</published>
<summary>Texto</summary>
</entry>
</feed>`;
    const items = parseFeedItems(xml);
    expect(items).toHaveLength(1);
    expect(items[0]!.link).toContain("lasillavacia.com");
  });
});
