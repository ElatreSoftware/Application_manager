declare module "next" {
  export interface NextConfig {
    eslint?: { dirs?: string[] };
    typescript?: { ignoreBuildErrors?: boolean };
    experimental?: Record<string, unknown>;
    [key: string]: unknown;
  }

  export default function (config: NextConfig): NextConfig;
}
