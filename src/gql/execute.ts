import axiosInstance from "@/config/axios-instance";
import type { TypedDocumentString } from "./graphql";
import { AxiosError } from "axios";

export async function execute<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
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
      throw new Error(`GraphQL Error: ${result.errors.map((e: { message: string }) => e.message).join(", ")}`);
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
      throw new Error(`Unknown Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// Specialized execution function for file uploads using multipart/form-data
export async function executeWithFileUpload<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  variables: TVariables,
) {
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
      throw new Error(`GraphQL Error: ${result.errors.map((e: { message: string }) => e.message).join(", ")}`);
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
      throw new Error(`Unknown Error: ${error instanceof Error ? error.message : String(error)}`);
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
