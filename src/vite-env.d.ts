/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** WhatsApp number for the date confirmation link (digits only). */
  readonly VITE_WHATSAPP_NUMBER?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
