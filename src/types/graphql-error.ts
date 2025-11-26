// GraphQL Error types for better error handling
export interface GraphQLError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>;
  path?: Array<string | number>;
  extensions?: {
    detail?: string;
    code?: string;
    status?: number;
    [key: string]: unknown;
  };
}

export interface GraphQLResponse<T = unknown> {
  data?: T;
  errors?: GraphQLError[];
}

export interface GraphQLErrorWithDetails extends Error {
  graphQLErrors?: GraphQLError[];
}

export interface GraphQLErrorResponse {
  response?: {
    errors?: GraphQLError[];
  };
  errors?: GraphQLError[];
  graphQLErrors?: GraphQLError[];
  message?: string;
}