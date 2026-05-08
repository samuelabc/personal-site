interface TechIconEntry {
  slug: string;
  siKey: string;
}

export interface RichIconEntry {
  body: string;
  viewBox: string;
}

function entry(slug: string): TechIconEntry {
  return {
    slug,
    siKey: "si" + slug.charAt(0).toUpperCase() + slug.slice(1),
  };
}

export const techIconMap: Record<string, TechIconEntry> = {
  "React": entry("react"),
  "React Native": entry("react"),
  "TypeScript": entry("typescript"),
  "Go": entry("go"),
  "Golang": entry("go"),
  "Rust": entry("rust"),
  "Svelte": entry("svelte"),
  "SvelteKit": entry("svelte"),
  "Next.js": entry("nextdotjs"),
  "Node.js": entry("nodedotjs"),
  "Vue": entry("vuedotjs"),
  "Astro": entry("astro"),
  "Flutter": entry("flutter"),
  "Docker": entry("docker"),
  "Kubernetes": entry("kubernetes"),
  "Postgres": entry("postgresql"),
  "PostgreSQL": entry("postgresql"),
  "MySQL": entry("mysql"),
  "MongoDB": entry("mongodb"),
  "Redis": entry("redis"),
  "Firebase": entry("firebase"),
  "Tailwind": entry("tailwindcss"),
  "Cloudflare Pages": entry("cloudflarepages"),
  "wasm": entry("webassembly"),
  "Git": entry("git"),
  "PHP": entry("php"),
  "Kafka": entry("apachekafka"),
  "Elasticsearch": entry("elasticsearch"),
  "Grafana": entry("grafana"),
  "Sentry": entry("sentry"),
  "Posthog": entry("posthog"),
  "Express": entry("express"),
  "C++": entry("cplusplus"),
  "ArangoDB": entry("arangodb"),
};

function fromIconify(
  set: any,
  name: string,
): RichIconEntry | null {
  const icon = set.icons[name];
  if (!icon) return null;
  const w = icon.width || set.width || 128;
  const h = icon.height || set.height || 128;
  return { body: icon.body, viewBox: `0 0 ${w} ${h}` };
}

let cachedRichIcons: Record<string, RichIconEntry> | null = null;

export async function loadRichIcons(): Promise<Record<string, RichIconEntry>> {
  if (cachedRichIcons) return cachedRichIcons;
  const logosMod = await import("@iconify-json/logos");
  const logos = logosMod.icons;

  cachedRichIcons = {
    "AWS": fromIconify(logos, "aws")!,
    "Azure": fromIconify(logos, "azure-icon")!,
    "VS Code API": fromIconify(logos, "visual-studio-code")!,
  };
  return cachedRichIcons;
}
