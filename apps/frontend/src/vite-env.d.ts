/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_DEBOUNCE_DELAY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
