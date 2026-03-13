export interface Book {
  title: string;
  slug: string;
  author: string;
  cover?: string;
  rating: number;
  note: string;
  year: string;
  color: string;
  category: "general" | "technical";
}

export const books: Book[] = [
  {
    title: "The Beginning of Infinity",
    slug: "the-beginning-of-infinity",
    author: "David Deutsch",
    cover: "/assets/books/the-beginning-of-infinity.png",
    rating: 5,
    note: "A profound argument that all progress comes from good explanations. Changed how I think about knowledge, science, and the reach of human understanding.",
    year: "2026",
    color: "#6b3a3a",
    category: "general",
  },
  {
    title: "Designing Data-Intensive Applications",
    slug: "designing-data-intensive-applications",
    author: "Martin Kleppmann",
    cover: "/assets/books/designing-data-intensive-applications.png",
    rating: 5,
    note: "The definitive guide to distributed systems trade-offs. Every chapter reveals how little you actually knew about data infrastructure.",
    year: "2022",
    color: "#2d4a3e",
    category: "technical",
  },
  {
    title: "Building Evolutionary Architectures",
    slug: "building-evolutionary-architectures",
    author: "Neal Ford, Rebecca Parsons & Patrick Kua",
    cover: "/assets/books/building-evolutionary-architectures.png",
    rating: 4,
    note: "A practical framework for designing systems that can adapt over time. The fitness-function concept is a powerful lens for architecture decisions.",
    year: "2023",
    color: "#3a4a6b",
    category: "technical",
  },
];

export function getBookBySlug(slug: string) {
  return books.find((b) => b.slug === slug);
}
