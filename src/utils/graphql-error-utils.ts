import { GraphQLError, GraphQLErrorResponse } from "@/types/graphql-error";

/**
 * GraphQL Error Helper class for easy access to error properties
 * Usage:
 *   const error = parseGraphQLError(e);
 *   const detail = error.detail;
 *   const code = error.code;
 *   const message = error.message;
 */
export class GraphQLErrorHelper {
  private readonly error: GraphQLErrorResponse;
  private readonly defaultMessage: string;

  constructor(error: unknown, defaultMessage = "An error occurred. Please try again.") {
    this.error = error as GraphQLErrorResponse;
    this.defaultMessage = defaultMessage;
  }

  /**
   * Get the first GraphQL error object
   */
  private get firstError(): GraphQLError | undefined {
    return (
      this.error.graphQLErrors?.[0] ||
      this.error.errors?.[0] ||
      this.error.response?.errors?.[0]
    );
  }

  /**
   * Get error detail from extensions.detail
   */
  get detail(): string {
    const detail = this.firstError?.extensions?.detail;
    if (detail) return detail;

    if (this.error.message) return this.error.message;
    if (this.error instanceof Error) return this.error.message;

    return this.defaultMessage;
  }

  /**
   * Get all error details as array
   */
  get details(): string[] {
    const messages: string[] = [];

    // Get from graphQLErrors
    this.error.graphQLErrors?.forEach((err) => {
      const detail = err.extensions?.detail;
      if (detail) messages.push(detail);
    });

    // Get from errors
    if (messages.length === 0) {
      this.error.errors?.forEach((err) => {
        const detail = err.extensions?.detail;
        if (detail) messages.push(detail);
      });
    }

    // Get from response.errors
    if (messages.length === 0) {
      this.error.response?.errors?.forEach((err) => {
        const detail = err.extensions?.detail;
        if (detail) messages.push(detail);
      });
    }

    if (messages.length === 0 && this.error.message) {
      messages.push(this.error.message);
    }

    if (messages.length === 0 && this.error instanceof Error) {
      messages.push(this.error.message);
    }

    return messages;
  }

  /**
   * Get error code from extensions.code
   */
  get code(): string | undefined {
    return this.firstError?.extensions?.code;
  }

  /**
   * Get error status from extensions.status
   */
  get status(): number | undefined {
    return this.firstError?.extensions?.status;
  }

  /**
   * Get the raw error message
   */
  get message(): string {
    return this.error.message || this.defaultMessage;
  }

  /**
   * Get all raw GraphQL errors
   */
  get errors(): GraphQLError[] {
    return (
      this.error.graphQLErrors ||
      this.error.errors ||
      this.error.response?.errors ||
      []
    );
  }

  /**
   * Check if error has specific code
   */
  isCode(code: string): boolean {
    return this.code === code;
  }

  /**
   * Check if error has specific status
   */
  isStatus(status: number): boolean {
    return this.status === status;
  }

  /**
   * Get formatted error message for display
   */
  toString(): string {
    return this.detail;
  }
}

/**
 * Parse GraphQL error into helper object for easy access
 * 
 * @example
 * const error = parseGraphQLError(e);
 * console.log(error.detail); // Get error detail
 * console.log(error.code); // Get error code
 * console.log(error.status); // Get error status
 * if (error.isCode("AUTH_NOT_AUTHENTICATED")) { ... }
 */
export function parseGraphQLError(
  error: unknown,
  defaultMessage?: string,
): GraphQLErrorHelper {
  return new GraphQLErrorHelper(error, defaultMessage);
}

/**
 * Extract error details from an array of GraphQL errors
 * Returns a formatted string of all error details joined by ", "
 * 
 * @param errors - Array of GraphQL errors
 * @param defaultMessage - Default message if no details found
 * @returns Formatted error message string
 * 
 * @example
 * const message = getErrorDetailsFromArray(result.errors);
 * // Returns: "User not found, Invalid input"
 */
export function getErrorDetailsFromArray(
  errors: GraphQLError[],
  defaultMessage = "An error occurred",
): string {
  if (!errors || errors.length === 0) return defaultMessage;

  const details = errors
    .map((e) => e.extensions?.detail)
    .filter((detail): detail is string => !!detail);

  return details.length > 0 ? details.join(", ") : defaultMessage;
}

