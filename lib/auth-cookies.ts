import { env } from "./env";

type RequestLike = Request | Headers;

function getHeaders(request: RequestLike): Headers {
  return request instanceof Headers ? request : request.headers;
}

export function shouldUseSecureAuthCookies(request: RequestLike): boolean {
  const headers = getHeaders(request);
  const forwardedProto = headers.get("x-forwarded-proto");

  if (forwardedProto) {
    return forwardedProto.split(",")[0]?.trim() === "https";
  }

  if (!(request instanceof Headers)) {
    try {
      return new URL(request.url).protocol === "https:";
    } catch {
      // Fall through to AUTH_URL or environment defaults.
    }
  }

  if (env.AUTH_URL) {
    try {
      return new URL(env.AUTH_URL).protocol === "https:";
    } catch {
      // Fall through to NODE_ENV default.
    }
  }

  return env.NODE_ENV === "production";
}

export function getSessionCookieName(request: RequestLike): string {
  return `${shouldUseSecureAuthCookies(request) ? "__Secure-" : ""}authjs.session-token`;
}
