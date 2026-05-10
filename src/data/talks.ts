export interface Talk {
  slug: string;
  title: string;
  date: string;
  description: string;
  pdfPath: string;
  slidesPath?: string;
  event?: string;
}

export const talks: Talk[] = [
  {
    slug: "consistency-models",
    title: "Consistency Models in Distributed Systems",
    date: "May 2026",
    description:
      "A first-principles tour of consistency models, from linearizability to eventual consistency. Covers the full hierarchy, production system choices (Dynamo, Spanner, CockroachDB), failure modes, and a practical decision framework.",
    slidesPath: "/talks/consistency-models/",
    pdfPath: "/talks/consistency-models/consistency-models-talk.pdf",
  },
  {
    slug: "durable-execution",
    title: "Durable Execution: An Introduction",
    date: "May 2026",
    description:
      "A first-principles walkthrough of durable execution: what breaks in distributed systems, why retries and queues aren't enough, and how workflow engines like DBOS, Temporal, and Restate approach the problem differently.",
    slidesPath: "/talks/durable-execution/",
    pdfPath: "/talks/durable-execution/durable-execution-talk.pdf",
  },
  {
    slug: "latest-trend",
    title: "Latest Trend on Software Development Techniques",
    date: "Aug 2025",
    description:
      "A survey of emerging software development techniques shaping how teams build, test, and ship modern applications.",
    pdfPath: "/talks/latest-trend/latest-trend.pdf",
  },
  {
    slug: "evolutionary",
    title: "Evolutionary Architecture Topologies",
    date: "Mar 2025",
    description:
      "How architecture evolves incrementally through fitness functions, guided change, and topology patterns that let systems adapt without big-bang rewrites.",
    pdfPath: "/talks/evolutionary/evolutionary-architecture.pdf",
  },
  {
    slug: "rsa",
    title: "A Brief Introduction to RSA",
    date: "Dec 2024",
    description:
      "The math and intuition behind RSA encryption: how prime numbers, modular arithmetic, and trapdoor functions make public-key cryptography work.",
    pdfPath: "/talks/rsa/rsa.pdf",
  },
];

export function getTalkBySlug(slug: string): Talk | undefined {
  return talks.find((t) => t.slug === slug);
}
