export interface Project {
  name: string;
  intro: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  screenshot?: string;
  year: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    name: "YoTalent",
    intro:
      "Champion of the Mercedes-Benz Malaysia AI Hackathon with an amazing team. We speedran building a talent ops platform with AI-powered candidate matching, intelligent interview question generation, a dedicated question bank, and interview scheduling. Easily one of the most fun builds I’ve worked on.",
    techStack: ["React", "TypeScript", "Golang", "LLM", "Vector Database"],
    demoUrl: "https://yotalent.samuelthien.site/",
    screenshot: "/assets/projects/yotalent.png",
    year: "2025",
    featured: true,
  },
  {
    name: "ReplyHero",
    intro:
      "Co-founded an AI auto-reply platform for WhatsApp and Messenger. Built the landing page, web portal, and Android app — basically everything user-facing.",
    techStack: ["Flutter", "Next.js", "Sentry", "Posthog", "Firebase", "AWS"],
    demoUrl: "https://replyhero.io/",
    screenshot: "/assets/projects/replyhero.png",
    year: "2024",
    featured: true,
  },
  {
    name: "datetime-helper",
    intro:
      "Got tired of Googling Unix timestamp conversions while debugging, so I built my own toolkit — date math, timezone juggling, and path queries as a first-class citizen. It also turned into a fun tech exploration: Rust + WebAssembly under the hood, Astro for layout, and Svelte for the UI logic, with built-in skills for AI agents to query it directly.",
    techStack: ["Rust", "wasm", "Astro", "Svelte", "Cloudflare Pages", "Tailwind"],
    githubUrl: "https://github.com/samuelabc/datetime-helper",
    demoUrl:
      "https://datetime.samuelthien.site/?o0=subtract%3A0%3Adays&s=now",
    screenshot: "/assets/projects/datetime-helper.png",
    year: "2025",
    featured: true,
  },
  {
    name: "AI PR Review",
    intro:
      "VS Code extension I built because I kept context-switching to review my own diffs. Generates PR-style comparisons between any two branches and kicks off a structured review in Copilot Chat.",
    techStack: ["TypeScript", "VS Code API", "Git"],
    githubUrl: "https://github.com/samuelabc/ai-pr-review-vscode-extension",
    demoUrl:
      "https://marketplace.visualstudio.com/items?itemName=SamuelThien.ai-pr-review",
    screenshot: "/assets/projects/ai-pr-review.png",
    year: "2026",
    featured: true,
  },
  {
    name: "Schedule Hero",
    intro:
      "Scheduling app where users and admins get completely different interfaces — my first real dive into role-based access control across a full-stack app.",
    techStack: ["React", "Node.js", "MongoDB", "Express"],
    demoUrl: "https://web-schedulehero.onrender.com",
    githubUrl: "https://github.com/samuelabc/ScheduleHeroWepApp",
    year: "2024",
    featured: false,
  },
  {
    name: "C-like Compiler",
    intro:
      "Takes a C-like language and compiles it down to executable MIPS machine code. Lexer, parser, code generator — the full pipeline.",
    techStack: ["C++", "MIPS Assembly"],
    githubUrl: "https://github.com/samuelabc/C-like-compiler-project",
    year: "2023",
    featured: false,
  },
  {
    name: "School Management System",
    intro:
      "Web app for managing class schedules where students, teachers, and admins each get their own tailored views and workflows.",
    techStack: ["React", "Node.js", "MySQL", "Express"],
    githubUrl: "https://github.com/samuelabc/school_management_system_v2",
    year: "2022",
    featured: false,
  },
  {
    name: "Mini MIPS CPU",
    intro:
      "Five-stage pipelined CPU in Verilog. Fetch, decode, execute, memory, writeback, with hazard detection and forwarding baked in.",
    techStack: ["Verilog HDL", "MIPS ISA"],
    githubUrl: "https://github.com/samuelabc/BUAA_ComputerOrganizationLab",
    year: "2021",
    featured: false,
  },
];
