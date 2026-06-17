import type { ComponentType } from 'react'
import { template as orderConfirmation } from './order-confirmation'
import { template as supportReply } from './support-reply'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  'order-confirmation': orderConfirmation,
  'support-reply': supportReply,
}
