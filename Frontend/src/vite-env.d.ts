/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL_TABLE: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_NO_OF_PAGES: number;
  readonly VITE_LIMIT_PER_PAGES: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
