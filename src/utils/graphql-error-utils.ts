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
   * Get error detail from extensions.detail or message
   */
  get detail(): string {
    // Cast error to any to access dynamic properties
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = this.error as any;

    // Debug: log the error structure to console
    console.log("Error object structure:", err);

    // Special case: Check if error has graphQLErrors property (from execute.ts)
    if (err?.graphQLErrors && Array.isArray(err.graphQLErrors) && err.graphQLErrors[0]?.message) {
      return err.graphQLErrors[0].message;
    }

    // Try direct errors array (common GraphQL response format)
    if (err?.errors && Array.isArray(err.errors) && err.errors[0]?.message) {
      return err.errors[0].message;
    }

    // Try nested response.errors
    if (err?.response?.errors && Array.isArray(err.response.errors) && err.response.errors[0]?.message) {
      return err.response.errors[0].message;
    }

    // Try networkError.result.errors (Apollo error format)
    if (err?.networkError?.result?.errors && Array.isArray(err.networkError.result.errors) && err.networkError.result.errors[0]?.message) {
      return err.networkError.result.errors[0].message;
    }

    // Try graphQLErrors array
    if (err?.graphQLErrors && Array.isArray(err.graphQLErrors) && err.graphQLErrors[0]?.message) {
      return err.graphQLErrors[0].message;
    }

    // Try to get message from firstError.message
    if (this.firstError?.message) {
      return this.firstError.message;
    }

    // Try extensions.detail
    const detail = this.firstError?.extensions?.detail;
    if (detail) return detail;

    // Try error.message - might be JSON string, try to parse it
    if (this.error.message) {
      try {
        // Try to parse as JSON in case it's a stringified error response
        const parsed = JSON.parse(this.error.message);
        if (parsed.errors && Array.isArray(parsed.errors) && parsed.errors[0]?.message) {
          return parsed.errors[0].message;
        }
      } catch {
        // If not JSON, return as is
      }
      return this.error.message;
    }
    
    // Try if error is Error instance
    if (this.error instanceof Error) {
      // Try to parse message as JSON
      try {
        const parsed = JSON.parse(this.error.message);
        if (parsed.errors && Array.isArray(parsed.errors) && parsed.errors[0]?.message) {
          return parsed.errors[0].message;
        }
      } catch {
        // If not JSON, return as is
      }
      return this.error.message;
    }

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
   * Get the raw error message (prioritize errors[0].message)
   */
  get message(): string {
    // Try to get from firstError.message first
    if (this.firstError?.message) {
      return this.firstError.message;
    }
    
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
 * Enhanced GraphQL Error Access with dynamic property access
 * Allows accessing any error property like: errors.message, errors.locations, etc.
 */
export class GraphQLErrorAccess {
  private readonly errorHelper: GraphQLErrorHelper;
  private readonly rawErrors: GraphQLError[];

  constructor(error: unknown, defaultMessage?: string) {
    this.errorHelper = new GraphQLErrorHelper(error, defaultMessage);
    this.rawErrors = this.errorHelper.errors;
  }

  // Helper methods from GraphQLErrorHelper
  get detail(): string { return this.errorHelper.detail; }
  get message(): string { return this.errorHelper.message; }
  get code(): string | undefined { return this.errorHelper.code; }
  get status(): number | undefined { return this.errorHelper.status; }
  get details(): string[] { return this.errorHelper.details; }
  get errors(): GraphQLError[] { return this.errorHelper.errors; }
  isCode(code: string): boolean { return this.errorHelper.isCode(code); }
  isStatus(status: number): boolean { return this.errorHelper.isStatus(status); }
  toString(): string { return this.errorHelper.toString(); }

  // Dynamic property access for first error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(property: string): any {
    const firstError = this.rawErrors[0];
    if (!firstError) return undefined;
    
    // Support nested property access like "locations.0.line"
    return this.getNestedProperty(firstError, property);
  }

  // Get property from specific error by index
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getFromError(errorIndex: number, property: string): any {
    const error = this.rawErrors[errorIndex];
    if (!error) return undefined;
    
    return this.getNestedProperty(error, property);
  }

  // Get property from all errors as array
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAll(property: string): any[] {
    return this.rawErrors.map(error => this.getNestedProperty(error, property)).filter(val => val !== undefined);
  }

  // Helper to access nested properties
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      if (current && typeof current === 'object') {
        return current[key];
      }
      return undefined;
    }, obj);
  }

  // Shorthand access methods
  get locations() { return this.get('locations'); }
  get path() { return this.get('path'); }
  get extensions() { return this.get('extensions'); }
  
  // Location specific helpers
  get line() { return this.get('locations.0.line'); }
  get column() { return this.get('locations.0.column'); }
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
 * Parse GraphQL error with enhanced access capabilities
 * 
 * @example
 * const errors = parseGraphQLErrorEnhanced(e);
 * console.log(errors.message); // Get error message
 * console.log(errors.get('locations')); // Get locations
 * console.log(errors.line); // Get line from first location
 * console.log(errors.column); // Get column from first location
 * console.log(errors.get('extensions.code')); // Get nested code
 * console.log(errors.getAll('message')); // Get all messages
 * console.log(errors.getFromError(1, 'locations')); // Get locations from second error
 */
export function parseGraphQLErrorEnhanced(
  error: unknown,
  defaultMessage?: string,
): GraphQLErrorAccess {
  return new GraphQLErrorAccess(error, defaultMessage);
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

  // Try to get message first, then fallback to extensions.detail
  const messages = errors
    .map((e) => e.message || e.extensions?.detail)
    .filter((msg): msg is string => !!msg);

  return messages.length > 0 ? messages.join(", ") : defaultMessage;
}

