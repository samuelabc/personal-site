import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const FONTS_DIR = join(process.cwd(), "src/assets/fonts");

const instrumentSerifRegular = readFileSync(
  join(FONTS_DIR, "InstrumentSerif-Regular.ttf"),
);
const spaceMonoRegular = readFileSync(
  join(FONTS_DIR, "SpaceMono-Regular.ttf"),
);

const WIDTH = 1200;
const HEIGHT = 630;

const svg = await satori(
  {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#f4f0e8",
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
                    color: "#6b6b6b",
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
                    backgroundColor: "#1a1a1a",
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
                    fontSize: "64px",
                    color: "#1a1a1a",
                    lineHeight: 1.05,
                    marginBottom: "20px",
                    fontFamily: "Instrument Serif",
                    fontWeight: 400,
                  },
                  children: "Samuel Thien",
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    fontSize: "22px",
                    color: "#6b6b6b",
                    fontFamily: "Space Mono",
                    lineHeight: 1.5,
                  },
                  children: "Full Stack Engineer",
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
                    backgroundColor: "#c1440e",
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
                    color: "#6b6b6b",
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
  },
  {
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
    ],
  },
);

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: WIDTH },
});
const pngData = resvg.render();
const png = pngData.asPng();

writeFileSync(join(process.cwd(), "public/og-default.png"), png);
console.log("Generated public/og-default.png");
