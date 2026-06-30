import type { ComponentType } from 'react'
import { template as orderConfirmation } from './order-confirmation'
import { template as supportReply } from './support-reply'
import { template as paymentLink } from './payment-link'
import { template as cryptoPayment } from './crypto-payment'
import { template as orderShipped } from './order-shipped'
import { template as orderPending } from './order-pending'
import { template as adminNewOrder } from './admin-new-order'

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
  'payment-link': paymentLink,
  'crypto-payment': cryptoPayment,
  'order-shipped': orderShipped,
  'order-pending': orderPending,
  'admin-new-order': adminNewOrder,
}
