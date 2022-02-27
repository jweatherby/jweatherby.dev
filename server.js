import { createRequestHandler } from "@remix-run/vercel";
import * as build from "@remix-run/dev/server-build";

export default createRequestHandler({
  build,
  getLoadContext(req, res) {
    return require('./posts')
  },
  mode: process.env.NODE_ENV
});
