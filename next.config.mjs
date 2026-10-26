/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // pdf.js referencia el paquete "canvas" de Node; en el navegador no se usa.
  webpack(config) {
    config.resolve.alias = { ...(config.resolve.alias || {}), canvas: false };
    return config;
  },
  // El sitio anterior (intermediación, retirado en V3) tenía estas rutas: 308 a la página nueva más cercana.
  async redirects() {
    const home = (source) => ({ source, destination: "/", permanent: true });
    return [
      { source: "/en/services/supplier-verification", destination: "/limits", permanent: true },
      { source: "/en/guides/rfq-checklist-cnc-parts-mexico", destination: "/sample-report", permanent: true },
      { source: "/en/guides/vet-cnc-supplier-mexico", destination: "/sample-report", permanent: true },
      { source: "/es/guias/as9100-nadcap-certificaciones", destination: "/industries/aerospace", permanent: true },
      { source: "/en/about", destination: "/trust", permanent: true },
      { source: "/es/nosotros", destination: "/trust", permanent: true },
      home("/en"), home("/en/:path*"), home("/es"), home("/es/:path*"), home("/index.html"),
      home("/en_index.html"), home("/es_index.html"), home("/assets/:path*"), home("/css/:path*"), home("/js/:path*"),
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // El producto (/app) nunca se indexa.
      { source: "/app/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};
export default nextConfig;
