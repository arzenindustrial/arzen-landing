import type { Metadata } from "next";
import { PublicReport } from "./public-report";

export const metadata: Metadata = { title: "Verified with Arzen", robots: { index: false, follow: false } };

export default function Page({ params }: { params: { token: string } }) {
  return <PublicReport token={params.token} />;
}
