export type ParsedFeedItem = {
  title: string;
  link: string;
  date: string;
  summary: string;
};

function decodeXml(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function tagText(block: string, tag: string): string {
  const re = new RegExp(
    `<${tag}[^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))</${tag}>`,
    "i",
  );
  const m = block.match(re);
  if (!m) return "";
  return decodeXml(m[1] || m[2] || "");
}

function linkFromItem(block: string): string {
  const tagged = tagText(block, "link");
  if (tagged.startsWith("http")) return tagged;
  const href = block.match(/<link[^>]+href=["']([^"']+)["']/i);
  if (href?.[1]) return href[1];
  const guid = tagText(block, "guid");
  if (guid.startsWith("http")) return guid;
  const id = tagText(block, "id");
  if (id.startsWith("http")) return id;
  return "";
}

/** Parser mínimo RSS/Atom sin dependencias extra. */
export function parseFeedItems(xml: string): ParsedFeedItem[] {
  const items: ParsedFeedItem[] = [];
  const blocks = [
    ...xml.matchAll(/<item[\s>]([\s\S]*?)<\/item>/gi),
    ...xml.matchAll(/<entry[\s>]([\s\S]*?)<\/entry>/gi),
  ];
  for (const m of blocks) {
    const block = m[1] || "";
    const title = tagText(block, "title");
    const link = linkFromItem(block);
    const date =
      tagText(block, "pubDate") ||
      tagText(block, "published") ||
      tagText(block, "updated") ||
      "N/D";
    const summary =
      tagText(block, "description") ||
      tagText(block, "summary") ||
      tagText(block, "content") ||
      "";
    items.push({ title, link, date, summary });
  }
  return items;
}
