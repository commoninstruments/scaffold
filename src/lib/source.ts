import { docs } from "collections/server";
import { loader } from "fumadocs-core/source";

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  slugs(file) {
    if (file.path === "README.md") {
      return ["overview"];
    }

    return undefined;
  },
});
