import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Better Auth needs Node runtime (not Edge) for DB + crypto
export const runtime = "nodejs";

const handlers = toNextJsHandler(auth);

export async function GET(request: Request) {
  try {
    return await handlers.GET(request);
  } catch (error) {
    console.error("[api/auth GET]", error);
    return Response.json(
      {
        error: "Auth GET failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    return await handlers.POST(request);
  } catch (error) {
    console.error("[api/auth POST]", error);
    return Response.json(
      {
        error: "Auth POST failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
