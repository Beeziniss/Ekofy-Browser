import axiosInstance from "@/config/axios-instance";
import type { TypedDocumentString } from "./graphql";
import { AxiosError } from "axios";
import { setAccessTokenToLocalStorage } from "@/utils/auth-utils";
import { GraphQLError, GraphQLErrorWithDetails } from "@/types/graphql-error";
import { getErrorDetailsFromArray } from "@/utils/graphql-error-utils";

// Helper function to check if GraphQL error indicates authentication failure
function isAuthenticationError(errors: GraphQLError[]): boolean {
  return errors.some(
    (error) => error.extensions?.code === "AUTH_NOT_AUTHENTICATED" || error.extensions?.status === 401,
  );
}

export async function execute<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
): Promise<TResult> {
  return executeRequest(query, variables, false);
}

async function executeRequest<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  variables: TVariables | undefined,
  isRetry: boolean,
): Promise<TResult> {
  try {
    const response = await axiosInstance.post(
      "/graphql",
      {
        query,
        variables,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.data) {
      throw new Error("Network response was not ok");
    }

    const result = response.data;

    // GraphQL responses have a "data" field that contains the actual query result
    // and optionally an "errors" field
    if (result.errors) {
      // Check if it's an authentication error and we haven't already retried
      if (!isRetry && isAuthenticationError(result.errors)) {
        // Import the auth service here to avoid circular dependency
        const { authApi } = await import("@/services/auth-services");
        const { useAuthStore } = await import("@/store/stores/auth-store");

        const user = useAuthStore.getState().user;

        if (!user?.isRememberMe) {
          // Import query client to clear cache
          const { getQueryClient } = await import("@/providers/get-query-client");

          // 1. Clear user data from auth store
          useAuthStore.getState().clearUserData();

          // 2. Clear query client cache
          const queryClient = getQueryClient();
          queryClient.clear();

          // 3. Redirect to landing page
          if (typeof window !== "undefined") {
            window.location.href = "/landing";
          }

          // 4. Return null to prevent further execution
          return null as TResult;
        }

        // NOTE: Version 1
        /* // Attempt to refresh the token
        const refreshResponse = await authApi.general.refreshToken();

        const newAccessToken = refreshResponse.result.accessToken;

        // Save the new token to localStorage
        setAccessTokenToLocalStorage(newAccessToken);

        // Retry the original request with the new token
        return executeRequest(query, variables, true); */

        // NOTE: Version 2
        // If we are here, the user HAS "Remember Me", so we try to refresh
        try {
          const refreshResponse = await authApi.general.refreshToken();
          const newAccessToken = refreshResponse.result.accessToken;
          setAccessTokenToLocalStorage(newAccessToken);
          return executeRequest(query, variables, true);
        } catch (error) {
          console.error(error);

          // If refresh fails, clear all data and redirect
          const { getQueryClient } = await import("@/providers/get-query-client");
          useAuthStore.getState().clearUserData();

          const queryClient = getQueryClient();
          queryClient.clear();

          window.location.href = "/landing";
        }
      }

      // Create a custom error that preserves GraphQL error details
      const errorMessage = getErrorDetailsFromArray(result.errors);
      const graphqlError: GraphQLErrorWithDetails = new Error(errorMessage);
      graphqlError.graphQLErrors = result.errors;
      throw graphqlError;
    }

    return result.data as TResult;
  } catch (error: unknown) {
    // Enhanced error handling for better debugging
    if (error instanceof AxiosError) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(
          `HTTP Error ${error.response.status}: ${error.response.statusText}. ` +
            `Response: ${JSON.stringify(error.response.data)}`,
        );
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error(
          `Network Error: No response received. Check if the GraphQL endpoint is running at ${process.env.NEXT_PUBLIC_URL_ENDPOINT}`,
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(`Request Setup Error: ${error.message}`);
      }
    } else {
      // Handle non-Axios errors
      throw new Error(`${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// Specialized execution function for file uploads using multipart/form-data
export async function executeWithFileUpload<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  variables: TVariables,
): Promise<TResult> {
  return executeFileUploadRequest(query, variables, false);
}

async function executeFileUploadRequest<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  variables: TVariables,
  isRetry: boolean,
): Promise<TResult> {
  try {
    const formData = new FormData();

    // Add the GraphQL operations
    formData.append(
      "operations",
      JSON.stringify({
        query,
        variables: mapVariablesForUpload(variables),
      }),
    );

    // Create a map for file uploads
    const map: Record<string, string[]> = {};
    const files: File[] = [];
    const fileIndex = { value: 0 };

    // Extract files from variables and create the map
    extractFiles(variables, "variables", map, files, fileIndex);

    // Add the map
    formData.append("map", JSON.stringify(map));

    // Add each file
    files.forEach((file, index) => {
      formData.append(index.toString(), file);
    });

    const response = await axiosInstance.post("/graphql", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "GraphQL-Preflight": "true",
      },
    });

    if (!response.data) {
      throw new Error("Network response was not ok");
    }

    const result = response.data;

    // GraphQL responses have a "data" field that contains the actual query result
    // and optionally an "errors" field
    if (result.errors) {
      // Check if it's an authentication error and we haven't already retried
      if (!isRetry && isAuthenticationError(result.errors)) {
        const { authApi } = await import("@/services/auth-services");
        const { useAuthStore } = await import("@/store/stores/auth-store");

        const user = useAuthStore.getState().user;

        if (!user?.isRememberMe) {
          // Import query client to clear cache
          const { getQueryClient } = await import("@/providers/get-query-client");

          // 1. Clear user data from auth store
          useAuthStore.getState().clearUserData();

          // 2. Clear query client cache
          const queryClient = getQueryClient();
          queryClient.clear();

          // 3. Redirect to landing page
          if (typeof window !== "undefined") {
            window.location.href = "/landing";
          }

          // 4. Return null to prevent further execution
          return null as TResult;
        }

        // If we are here, the user HAS "Remember Me", so we try to refresh
        try {
          // Attempt to refresh the token
          const refreshResponse = await authApi.general.refreshToken();
          const newAccessToken = refreshResponse.result.accessToken;

          // Save the new token to localStorage
          setAccessTokenToLocalStorage(newAccessToken);

          // Retry the original request with the new token
          return executeFileUploadRequest(query, variables, true);
        } catch (error) {
          console.error(error);

          // If refresh fails, clear all data and redirect
          const { getQueryClient } = await import("@/providers/get-query-client");
          useAuthStore.getState().clearUserData();

          const queryClient = getQueryClient();
          queryClient.clear();

          if (typeof window !== "undefined") {
            window.location.href = "/landing";
          }
        }
      }

      // Create a custom error that preserves GraphQL error details
      const errorMessage = getErrorDetailsFromArray(result.errors);
      const graphqlError: GraphQLErrorWithDetails = new Error(errorMessage);
      graphqlError.graphQLErrors = result.errors;
      throw graphqlError;
    }

    return result.data as TResult;
  } catch (error: unknown) {
    // Enhanced error handling for better debugging
    if (error instanceof AxiosError) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(
          `HTTP Error ${error.response.status}: ${error.response.statusText}. ` +
            `Response: ${JSON.stringify(error.response.data)}`,
        );
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error(
          `Network Error: No response received. Check if the GraphQL endpoint is running at ${process.env.NEXT_PUBLIC_URL_ENDPOINT}`,
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(`Request Setup Error: ${error.message}`);
      }
    } else {
      // Handle non-Axios errors
      throw new Error(`${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// Helper function to extract files from variables and create upload map
function extractFiles(
  obj: unknown,
  path: string,
  map: Record<string, string[]>,
  files: File[],
  fileIndex: { value: number },
): unknown {
  if (obj instanceof File) {
    const index = fileIndex.value++;
    files.push(obj);
    map[index.toString()] = [path];
    return null; // Replace file with null in variables
  }

  if (Array.isArray(obj)) {
    return obj.map((item, index) => extractFiles(item, `${path}.${index}`, map, files, fileIndex));
  }

  if (obj && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const newPath = path === "variables" ? `${path}.${key}` : path ? `${path}.${key}` : key;
      result[key] = extractFiles(value, newPath, map, files, fileIndex);
    }
    return result;
  }

  return obj;
}

// Helper function to map variables for upload by replacing files with null
function mapVariablesForUpload(variables: unknown): unknown {
  const fileIndex = { value: 0 };
  const map: Record<string, string[]> = {};
  const files: File[] = [];

  return extractFiles(variables, "variables", map, files, fileIndex);
}
