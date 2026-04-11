import type { APIRoute, GetStaticPaths } from "astro";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { books } from "../../data/books";

const FONTS_DIR = join(process.cwd(), "src/assets/fonts");

const instrumentSerifRegular = readFileSync(
  join(FONTS_DIR, "InstrumentSerif-Regular.ttf"),
);
const spaceMonoRegular = readFileSync(
  join(FONTS_DIR, "SpaceMono-Regular.ttf"),
);
const spaceMonoBold = readFileSync(join(FONTS_DIR, "SpaceMono-Bold.ttf"));

const WIDTH = 1200;
const HEIGHT = 630;
const BG = "#f4f0e8";
const INK = "#1a1a1a";
const MUTED = "#6b6b6b";
const ACCENT = "#c1440e";

interface OGPageData {
  title: string;
  subtitle: string;
}

export const getStaticPaths: GetStaticPaths = () => {
  const pages: { params: { slug: string }; props: OGPageData }[] = [
    {
      params: { slug: "index" },
      props: {
        title: "Samuel Thien",
        subtitle: "Full Stack Engineer",
      },
    },
    {
      params: { slug: "bookshelf" },
      props: {
        title: "Bookshelf",
        subtitle: "Classics, systems, and ideas that shaped my thinking.",
      },
    },
  ];

  for (const book of books) {
    pages.push({
      params: { slug: `bookshelf/${book.slug}` },
      props: {
        title: book.title,
        subtitle: book.author,
      },
    });
  }

  return pages;
};

function buildOGTemplate(title: string, subtitle: string) {
  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: BG,
        padding: "60px 70px",
      },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column" },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    fontFamily: "Space Mono",
                    fontSize: "14px",
                    color: MUTED,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.14em",
                    marginBottom: "12px",
                  },
                  children: "SAMUEL THIEN",
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    width: "60px",
                    height: "3px",
                    backgroundColor: INK,
                  },
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              flex: "1",
              justifyContent: "center",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    fontSize: title.length > 30 ? "52px" : "64px",
                    color: INK,
                    lineHeight: 1.05,
                    marginBottom: "20px",
                    fontFamily: "Instrument Serif",
                    fontWeight: 400,
                    maxWidth: "900px",
                  },
                  children: title,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    fontSize: "22px",
                    color: MUTED,
                    fontFamily: "Space Mono",
                    lineHeight: 1.5,
                    maxWidth: "700px",
                  },
                  children: subtitle,
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "12px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    width: "28px",
                    height: "3px",
                    backgroundColor: ACCENT,
                  },
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    fontFamily: "Space Mono",
                    fontSize: "14px",
                    color: MUTED,
                    letterSpacing: "0.05em",
                  },
                  children: "samuelthien.site",
                },
              },
            ],
          },
        },
      ],
    },
  };
}

export const GET: APIRoute = async ({ props }) => {
  const { title, subtitle } = props as OGPageData;

  const svg = await satori(buildOGTemplate(title, subtitle), {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      {
        name: "Instrument Serif",
        data: instrumentSerifRegular,
        weight: 400,
        style: "normal",
      },
      {
        name: "Space Mono",
        data: spaceMonoRegular,
        weight: 400,
        style: "normal",
      },
      {
        name: "Space Mono",
        data: spaceMonoBold,
        weight: 700,
        style: "normal",
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: WIDTH },
  });
  const pngData = resvg.render();
  const png = pngData.asPng();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
