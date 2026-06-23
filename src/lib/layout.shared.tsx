import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export const baseOptions = (): BaseLayoutProps => ({
  nav: {
    title: "Scaffold",
    url: "/",
  },
  links: [
    {
      active: "nested-url",
      text: "Docs",
      url: "/docs/overview",
    },
  ],
});
