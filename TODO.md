# Personal Site — TODO & Improvement Ideas

## Immediate — Replace Placeholders

- [x] Replace "Samuel" with your full name across Nav, Hero, Footer
- [x] Write real hero tagline and description
- [x] Write real About section copy (who you are, what drives you)
- [ ] Add your photo to the About section (`src/components/About.astro`)
- [x] Add real projects with titles, descriptions, links, and tags
- [x] Add real experience entries (roles, companies, dates)
- [ ] Add real blog posts or remove the Writing section for now
- [ ] Update social links in Footer (GitHub, Twitter/X, LinkedIn URLs)
- [x] Set contact email in the "Get in Touch" button (`src/components/Contact.astro`)
- [x] Update marquee strip text to match your actual status

## Content Infrastructure

- [ ] Set up Astro content collections for blog posts (Markdown/MDX)
- [ ] Create individual project detail pages (`/projects/[slug]`)
- [ ] Create individual blog post pages (`/writing/[slug]`)
- [ ] Add RSS feed for the blog (`@astrojs/rss`)
- [ ] Add a sitemap (`@astrojs/sitemap`)
- [ ] Add Open Graph / Twitter meta tags for link previews
- [ ] Add a favicon and web manifest

## Design Polish

- [ ] Add a dark mode toggle (brutalist dark: near-black bg, cream text, keep coral accent)
- [x] Improve mobile layout — stack About grid vertically, adjust hero font size
- [ ] Add staggered reveal to project cards (delay each by 100ms)
- [ ] Add a custom cursor or cursor trail as a signature detail
- [ ] Add a "back to top" button that appears on scroll
- [ ] Consider a page transition animation between routes
- [ ] Add subtle grain/noise texture to the background for depth
- [ ] Explore a project thumbnail/preview image on hover

## Performance & SEO

- [ ] Optimize font loading (swap display strategy, subset fonts)
- [x] Add `loading="lazy"` to images
- [x] Pre-render all pages at build time (Astro default — verify)
- [ ] Run Lighthouse audit and address any flags
- [ ] Add structured data (JSON-LD) for person schema
- [ ] Ensure all interactive elements are keyboard accessible

## Deployment

- [ ] Choose hosting (Vercel / Netlify / Cloudflare Pages)
- [ ] Set up CI/CD pipeline (auto-deploy on push to main)
- [ ] Connect custom domain
- [ ] Set up analytics (Plausible, Fathom, or similar privacy-friendly option)

## Nice-to-Have / Stretch

- [ ] Add a `/uses` page (tools, gear, setup)
- [ ] Add a `/now` page (what you're currently up to)
- [ ] Add a newsletter signup (Buttondown, ConvertKit, or Resend)
- [ ] Integrate a reading list or bookmarks section
- [ ] Add code syntax highlighting theme for blog posts (match site palette)
- [ ] Easter egg or hidden interaction somewhere on the site
