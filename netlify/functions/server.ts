import serverless from "serverless-http";

let serverlessHandler: ReturnType<typeof serverless> | null = null;

async function getHandler() {
  if (!serverlessHandler) {
    const { createApiApp } = await import("../../server/index.js");
    const app = createApiApp();
    serverlessHandler = serverless(app, { basePath: "/.netlify/functions/server" });
  }
  return serverlessHandler;
}

export const handler = async (event: unknown, context: unknown) => {
  try {
    const h = await getHandler();
    return await h(event, context);
  } catch (err) {
    console.error("Function error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: msg }),
    };
  }
};
