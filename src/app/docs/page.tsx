import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  description: "Browse Scaffold's canonical project docs.",
  title: "Docs",
};

const DocsPage = () => {
  redirect("/docs/overview");
};

export default DocsPage;
