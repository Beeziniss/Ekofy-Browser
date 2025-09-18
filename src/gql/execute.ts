import axiosInstance from "@/config/axios-instance";
import type { TypedDocumentString } from "./graphql";

export async function execute<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  // TODO: change this back to our api endpoint
  const response = await axiosInstance.post(
    process.env.NEXT_PUBLIC_URL_ENDPOINT + "/graphql",
    {
      query,
      variables,
    },
  );

  if (!response.data) {
    throw new Error("Network response was not ok");
  }

  const result = response.data;

  // GraphQL responses have a "data" field that contains the actual query result
  // and optionally an "errors" field
  if (result.errors) {
    throw new Error(
      `GraphQL Error: ${result.errors.map((e: { message: string }) => e.message).join(", ")}`,
    );
  }

  return result.data as TResult;
}
