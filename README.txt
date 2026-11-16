STUZEN TECHNOLOGIES - static website
====================================

Open index.html in a web browser (double-click it), or serve the folder
with any static web server. No build step or internet connection is needed.

Pages:
  index.html                                  Home
  about/index.html                            About
  services/index.html                         All services
  services/website-development/index.html     Website development
  services/secure-website-building/index.html Secure website building
  services/custom-software/index.html         Custom software
  services/ai-automation/index.html           AI and automation
  services/seo/index.html                     SEO
  contact/index.html                          Contact

Files:
  index.html, about/, services/, contact/     Page markup
  styles.css                                  All styles and embedded webfonts
  app.js                                      Site behaviour (vanilla JS)
  assets/                                     Images used by the pages
  sitemap.xml                                 Search engine sitemap
  robots.txt                                  Crawl rules

Notes:
  - Navigation uses normal static URLs, for example /about/ and /services/seo/.
  - The contact form validates in the browser only. This build has no
    connected form endpoint, so enquiries are not transmitted automatically;
    the success message offers a prefilled email draft instead.
  - To make the form live, connect the form to an approved backend or form
    service and replace the demo success behaviour in app.js.
  - External links (email, phone, WhatsApp, Instagram, Google Maps) open
    normally.
