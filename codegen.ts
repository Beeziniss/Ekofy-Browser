import type { CodegenConfig } from "@graphql-codegen/cli";
import "./envConfig.ts";

const config: CodegenConfig = {
  schema: process.env.NEXT_PUBLIC_URL_ENDPOINT + "/graphql",
  documents: ["src/**/*.tsx"],
  ignoreNoDocuments: true,
  generates: {
    "./src/gql/": {
      preset: "client",
      config: {
        documentMode: "string",
      },
    },
    "./schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
      },
    },
  },
};

export default config;
