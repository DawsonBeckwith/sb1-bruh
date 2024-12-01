/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ODDS_API_KEY: string
  readonly VITE_XAI_API_KEY: string
  readonly VITE_POLYGON_API_KEY: string
  readonly VITE_POLYGON_SECRET: string
  readonly VITE_STRIPE_PUBLIC_KEY: string
  readonly VITE_STRIPE_PRICE_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}