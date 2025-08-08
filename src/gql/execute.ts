import type { TypedDocumentString } from "./graphql";

export async function execute<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  // TODO: change this back to our api endpoint
  const response = await fetch("https://graphql.org/graphql/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/graphql-response+json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const result = await response.json();

  // GraphQL responses have a "data" field that contains the actual query result
  // and optionally an "errors" field
  if (result.errors) {
    throw new Error(
      `GraphQL Error: ${result.errors.map((e: { message: string }) => e.message).join(", ")}`,
    );
  }

  return result.data as TResult;
}
