const BASE_URL = process.env.BACKEND_API_URL;

type APIResponse<T> = {
  statusCode: number;
  status: "success" | "error";
  message?: string;
  data?: T;
  error?: unknown;
};

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
  ) {
    super(message);
  }
}

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, options);

  const contentType = response.headers.get("content-type");

  let body: APIResponse<T> | string;

  if (contentType?.includes("application/json")) {
    body = await response.json();
  } else {
    body = await response.text();
  }

  if (!response.ok) {
    if (typeof body === "string") {
      throw new Error(body);
    }

    throw new ApiError(body.statusCode, body.message || "");
  }

  if (typeof body === "string") {
    throw new Error("Unexpected non JSON response");
  }

  if (body.data === undefined) {
    throw new Error("API response missing data");
  }

  return body.data;
}

/*
 * Call the api route where a string response is expected.
 */
export async function apiString(
  path: string,
  options?: RequestInit,
): Promise<string> {
  const response = await fetch(`${BASE_URL}${path}`, options);

  const body = await response.text();

  if (!response.ok) {
    if (typeof body === "string") {
      throw new Error(body);
    }

    throw new Error();
  }

  if (typeof body !== "string") {
    throw new Error("Unexpected non string response");
  }

  return body;
}

// Helper function to wrap the api call in try/catch.
// Returns:
// - if ok: the api response
// - if 404: null
// - other errors: throws
export async function apiOrNull<T>(
  path: string,
  options?: RequestInit,
): Promise<T | null> {
  try {
    return await api<T>(path, options);
  } catch (e) {
    if (e instanceof ApiError && e.statusCode === 404) {
      return null;
    }

    throw e;
  }
}

// Helper function to wrap the api call in try/catch.
// Returns:
// - if ok: the api response
// - if 404: empty collection
// - other errors: throws
export async function apiOrEmpty<T>(
  path: string,
  options?: RequestInit,
): Promise<T[]> {
  try {
    return await api<T[]>(path, options);
  } catch (e) {
    if (e instanceof ApiError && e.statusCode === 404) {
      return [];
    }

    throw e;
  }
}
