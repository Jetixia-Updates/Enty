import serverless from "serverless-http";
import { createApiApp } from "../../server/index.js";

const app = createApiApp();
export const handler = serverless(app);
