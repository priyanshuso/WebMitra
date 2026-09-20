# WebMitra — website files

Seven static HTML pages sharing one stylesheet and one script. No build step, no
dependencies, no server code. Upload the folder and it works.

## Files

```
index.html               Home
services.html            Services
who-we-help.html         Who we help
why-us.html              Why us
demos.html               Demos
pricing.html             Pricing
contact.html             Contact
assets/styles.css        All styling for every page
assets/script.js         Mobile menu, hero toggle, scroll animations, demo previews, contact form
assets/images/           Photos used on the "Who we help" cards
sitemap.xml              For Google Search Console
robots.txt
```

## What's animated now

- **Home page "How it works"** is now a vertical scroll-driven timeline instead
  of the old horizontal row. A progress line fills as you scroll, and each step
  lights up (icon glow, subtle scale, full opacity) as it crosses the trigger
  point, and dims again if you scroll back up. Built with `getBoundingClientRect`
  + `requestAnimationFrame` in `assets/script.js` — no animation library used.
- **"Who we help" cards** zoom their photo slightly and reveal a soft gradient
  wash on hover, with a matching shadow lift. On touch devices (no hover), the
  cards instead fade/slide into place as you scroll to them — same effect,
  different trigger.
- **Every section heading and card grid** fades and slides in once as it enters
  the viewport (`IntersectionObserver`, one-time — it won't re-trigger or flicker
  if you scroll past it again).
- **Nav links** get an animated underline sweep on hover, an active-page
  indicator that updates as you navigate, and a brief press-down effect on
  click. The same underline treatment is on footer links and breadcrumbs.
- **`prefers-reduced-motion`** is fully respected: if a visitor's system has
  reduced motion turned on, every animation above is skipped and content shows
  in its final state immediately.
- Everything above animates only `transform` and `opacity` (GPU-friendly), so
  it shouldn't cause layout jank or slow the page down.

Nothing about the existing layout, colours, fonts, section order, links, or
functionality changed — this was purely additive.

## Real photos used

Two of the three "Who we help" cards now use real photos instead of the earlier
custom illustrations:

- **Schools & colleges** card → the school building photo you sent.
- **Small businesses & services** card → the restaurant interior photo you sent.
- **Local shops & showrooms** card still uses the custom illustration, since no
  shop photo was provided. Send one (a storefront or interior shot) and it can
  go in the same way, in the same spot.

Both files live at `assets/images/school-building.jpg` and
`assets/images/service-business.jpg`, resized to 1000px wide and compressed to
under 160 KB each so they don't slow the page down.

## Already set

- **Phone:** +91 95559 64902 - drives the floating WhatsApp button, the footer
  `tel:` link, the WhatsApp link on the contact page, and the enquiry form's
  WhatsApp handoff. To change it later, edit the `PHONE` constant at the top of
  `assets/script.js` (this updates the widget and the form together), then also
  update the `tel:` and `wa.me` links written directly into the footer and
  `contact.html`.
- **Address:** Transport Nagar, Kokta, Bhopal, Madhya Pradesh - shown in the
  footer of every page and on `contact.html`.

## Change these before going live

**1. Email and social handles.** Search and replace across all seven files:

- `hello@webmitra.in` - your email
- `@webmitra.in` - your Instagram handle
- The LinkedIn and Instagram links in the footer currently point to `contact.html`;
  replace with your real profile URLs.

**2. Your domain.** Every page has a `<link rel="canonical">` and Open Graph tags
pointing at `https://www.webmitra.in/`. Replace that domain in all seven files,
plus in `sitemap.xml` and `robots.txt`. Getting this wrong confuses Google, so do
it before you submit the sitemap.

**3. Prices.** `pricing.html` lists Rs 6,999 / 14,999 / 24,999 and Rs 499 per month
for maintenance. `index.html` repeats the Rs 6,999 starting price in the hero.

**4. Testimonials are dummy placeholders.** The three reviews on `index.html`
(Rohit Sharma, Anjali Pandey, Vikram Kushwaha) are sample content to show the
format. Replace with real client quotes once you have them — using invented
reviews with real business names on a live site can create legal and trust
problems, so swap these out before launch.

**5. The FAQ answers commit you to specific terms** — a full refund if the client
rejects the design preview, Rs 800 per extra page, domain registered in the
client's name. These appear on `why-us.html` and `pricing.html`. Change anything
you don't actually offer.

## The hero's before/after toggle

The homepage hero has a "Before / After WebMitra" switch above the device
mockup — clicking it dulls the mockup to look like a dated website, then
restores it, to make the "Transform your business" headline concrete instead of
abstract. Pure CSS + JS, no images involved, so it always loads instantly.

## Hosting

Any static host works. Free options that handle this well:

- **Netlify** — drag the folder onto app.netlify.com/drop. Live in seconds.
- **Cloudflare Pages** — connect a Git repo or upload directly.
- **GitHub Pages** — push the folder, enable Pages in repo settings.
- **Shared hosting (Hostinger, cPanel)** — upload everything into `public_html`.

Point your domain at the host, and make sure HTTPS is switched on. All four
options above issue a free SSL certificate automatically.

## Dropping the .html extension

If you'd prefer `yoursite.com/pricing` over `yoursite.com/pricing.html`, most
hosts support this. On Netlify or Cloudflare Pages it's on by default — just
update the `href` values in the nav and footer, and the canonical tags, to match.
On Apache hosting add a `.htaccess` file:

```
RewriteEngine On
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.*)$ $1.html [L]
```

## After launch

1. Add the site to **Google Search Console** and submit `sitemap.xml`.
2. Create a **Google Business Profile** and link it to your homepage.
3. Add an OG share image (1200x630) and reference it from each page's
   `<meta property="og:image">` — currently absent, so links shared on WhatsApp
   and LinkedIn will show no preview picture.

## The contact form

The form doesn't send email. It validates the input, then opens WhatsApp with the
enquiry pre-filled so the visitor taps send. This needs no backend and enquiries
land somewhere you'll actually see them.

If you'd rather receive emails, sign up for Formspree or Web3Forms, then replace
the submit handler in `assets/script.js` with a `fetch()` POST to their endpoint.
Both have free tiers adequate for a few hundred enquiries a month.
