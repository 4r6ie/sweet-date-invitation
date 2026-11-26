/**
 * Central place for the personal details of the invitation.
 *
 * The WhatsApp number is read from the environment so that it never has to be
 * committed to a public repository. Copy `.env.example` to `.env.local` and set
 * `VITE_WHATSAPP_NUMBER` (digits only, including the country code).
 *
 * When no number is configured the "Confirm Our Date" button is hidden and the
 * rest of the experience still works normally.
 */

const sanitizeNumber = (value: string | undefined): string =>
  (value ?? '').replace(/\D/g, '')

export const WHATSAPP_NUMBER: string = sanitizeNumber(
  import.meta.env.VITE_WHATSAPP_NUMBER
)

export const APP_TITLE = 'Will You Say Yes? ❤️'

export const APP_TAGLINE = 'Let us start our own love story'
