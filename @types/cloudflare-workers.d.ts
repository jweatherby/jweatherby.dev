// The Worker's variables and secrets (`wrangler secret put`, or .dev.vars locally).
// Only the env export is used, so this stands in for @cloudflare/workers-types.
declare module 'cloudflare:workers' {
  export const env: Readonly<Record<string, string | undefined>>;
}
