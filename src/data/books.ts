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
    note: "Deutsch argues that all progress comes from good explanations, and he's surprisingly convincing. This book rewired how I think about knowledge and what counts as real understanding.",
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
    note: "The best technical book I've read. Every chapter made me realize how little I actually understood about data infrastructure. Humbling and useful in equal measure.",
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
    note: "Practical framework for designing systems that can change without falling apart. The fitness-function idea stuck with me and keeps showing up in how I think about architecture.",
    year: "2023",
    color: "#3a4a6b",
    category: "technical",
  },
];

export function getBookBySlug(slug: string) {
  return books.find((b) => b.slug === slug);
}
