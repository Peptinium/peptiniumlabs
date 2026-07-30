import { createServerFn } from '@tanstack/react-start'

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/woocommerce'

export type WcProduct = {
  id: number
  name: string
  slug: string
  permalink: string
  price: string
  regular_price: string
  sale_price: string
  on_sale: boolean
  stock_status: 'instock' | 'outofstock' | 'onbackorder'
  short_description: string
  images: { src: string; alt: string }[]
  categories: { id: number; name: string; slug: string }[]
}

async function wcFetch(path: string, query: Record<string, string | number> = {}) {
  const apiKey = process.env.LOVABLE_API_KEY
  const connKey = process.env.WOOCOMMERCE_API_KEY
  if (!apiKey || !connKey) throw new Error('WooCommerce credentials missing')

  const qs = new URLSearchParams(
    Object.entries(query).reduce<Record<string, string>>((acc, [k, v]) => {
      acc[k] = String(v)
      return acc
    }, {}),
  )
  const url = `${GATEWAY_URL}${path}${qs.toString() ? `?${qs}` : ''}`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'X-Connection-Api-Key': connKey,
    },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`WooCommerce ${res.status}: ${body.slice(0, 200)}`)
  }
  return res.json()
}

export const listWcProducts = createServerFn({ method: 'GET' })
  .inputValidator((input: { perPage?: number; page?: number } | undefined) => input ?? {})
  .handler(async ({ data }): Promise<WcProduct[]> => {
    const raw = await wcFetch('/products', {
      per_page: data.perPage ?? 24,
      page: data.page ?? 1,
      status: 'publish',
    })
    return (raw as any[]).map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      permalink: p.permalink,
      price: p.price,
      regular_price: p.regular_price,
      sale_price: p.sale_price,
      on_sale: p.on_sale,
      stock_status: p.stock_status,
      short_description: p.short_description,
      images: (p.images ?? []).map((img: any) => ({ src: img.src, alt: img.alt ?? p.name })),
      categories: p.categories ?? [],
    }))
  })
