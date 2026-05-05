export interface Talk {
  slug: string;
  title: string;
  date: string;
  description: string;
  slidesPath: string;
  pdfFilename: string;
  event?: string;
}

export const talks: Talk[] = [
  {
    slug: "durable-execution",
    title: "Durable Execution: An Introduction",
    date: "May 2026",
    description:
      "A first-principles walkthrough of durable execution: what breaks in distributed systems, why retries and queues aren't enough, and how workflow engines like DBOS, Temporal, and Restate approach the problem differently.",
    slidesPath: "/talks/durable-execution/",
    pdfFilename: "durable-execution-talk.pdf",
  },
];

export function getTalkBySlug(slug: string): Talk | undefined {
  return talks.find((t) => t.slug === slug);
}
