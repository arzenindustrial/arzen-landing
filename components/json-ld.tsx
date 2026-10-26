import { PLANS } from "./pricing-cards";
import { isDemo } from "@/lib/demo";
import { CONTACT_EMAIL, SITE_URL as site } from "@/lib/site";

/** Datos estructurados (schema.org). Solo hechos que también se ven en la página. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export const ORG_ID = `${site}/#organization`;
export const APP_ID = `${site}/#software`;

export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization", "@id": ORG_ID, name: "Arzen Industrial Group", url: site,
        logo: `${site}/icon.svg`, brand: { "@type": "Brand", name: "Arzen" },
        contactPoint: { "@type": "ContactPoint", contactType: "sales", email: CONTACT_EMAIL, availableLanguage: ["en", "es"] },
      },
      { "@type": "WebSite", "@id": `${site}/#website`, url: site, name: "Arzen", publisher: { "@id": ORG_ID }, inLanguage: "en" },
    ],
  };
}

/** El producto y sus dos planes. Mientras el sitio corre en modo demo, la disponibilidad es PreOrder. */
export function softwareApp() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication", "@id": APP_ID, name: "Arzen", url: site,
    applicationCategory: "BusinessApplication", operatingSystem: "Web browser",
    description: "Reads material test reports (MTRs), checks each chemical and mechanical value against the specification limits with fixed rules, and builds audit-ready PDFs.",
    publisher: { "@id": ORG_ID },
    offers: PLANS.map((p) => ({
      "@type": "Offer", name: p.name, price: String(p.price), priceCurrency: "USD", url: `${site}/pricing`,
      availability: isDemo() ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
      priceSpecification: { "@type": "UnitPriceSpecification", price: String(p.price), priceCurrency: "USD", unitCode: "MON", referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" } },
    })),
  };
}

export function faqPage(items: string[][]) {
  return {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}
