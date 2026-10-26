import { JsonLd, siteGraph } from "@/components/json-ld";
import { RevealObserver } from "@/components/motion";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <RevealObserver />
      <JsonLd data={siteGraph()} />
    </>
  );
}
