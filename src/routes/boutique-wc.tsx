import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { SiteLayout } from '@/components/SiteLayout'
import { listWcProducts, type WcProduct } from '@/lib/woocommerce.functions'

const wcProductsQuery = queryOptions({
  queryKey: ['wc-products'],
  queryFn: () => listWcProducts({ data: { perPage: 24 } }),
  staleTime: 5 * 60 * 1000,
})

export const Route = createFileRoute('/boutique-wc')({
  head: () => ({
    meta: [
      { title: 'Boutique WooCommerce — Peptinium Labs' },
      {
        name: 'description',
        content:
          'Démo headless : catalogue WooCommerce (boutique.peptinium.com) affiché avec le design Peptinium Labs.',
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(wcProductsQuery),
  component: BoutiqueWcPage,
  errorComponent: ({ error, reset }) => (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="mb-3 text-2xl font-semibold">Impossible de charger le catalogue</h1>
        <p className="mb-6 text-muted-foreground">{String(error?.message ?? error)}</p>
        <button
          onClick={() => reset()}
          className="rounded-xl border border-border px-5 py-2 hover:border-primary"
        >
          Réessayer
        </button>
      </div>
    </SiteLayout>
  ),
})

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

function formatPrice(price: string) {
  const n = Number(price)
  if (!Number.isFinite(n)) return price
  return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}

function BoutiqueWcPage() {
  const { data: products } = useSuspenseQuery(wcProductsQuery)

  return (
    <SiteLayout>
      <section className="border-b border-border/60 bg-surface/50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Démo headless · WooCommerce
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Catalogue <span className="logo-gradient-text">boutique.peptinium.com</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Ces produits sont chargés en direct depuis ton install WooCommerce via l'API REST, et
            affichés avec l'identité visuelle Peptinium Labs. Aucun code produit n'est dupliqué —
            la source de vérité reste WordPress.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </SiteLayout>
  )
}

function ProductCard({ product }: { product: WcProduct }) {
  const img = product.images[0]?.src
  const oos = product.stock_status === 'outofstock'
  return (
    <a
      href={product.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(30,35,64,0.15)]"
    >
      {oos && (
        <span className="absolute right-4 top-4 z-10 rounded-full bg-warning px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-warning-foreground">
          Rupture
        </span>
      )}
      <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-[oklch(0.72_0.15_200/0.08)] to-[oklch(0.50_0.26_296/0.08)]">
        {img ? (
          <img
            src={img}
            alt={product.images[0]?.alt ?? product.name}
            loading="lazy"
            className="h-full w-full object-contain p-4 transition-transform group-hover:scale-105"
          />
        ) : null}
      </div>
      {product.categories[0] && (
        <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {product.categories[0].name}
        </p>
      )}
      <h3 className="font-display text-lg font-semibold leading-tight text-foreground">
        {product.name}
      </h3>
      <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
        {stripHtml(product.short_description)}
      </p>
      <div className="mt-4 flex items-baseline justify-between">
        <span className="font-display text-2xl font-bold text-foreground">
          {formatPrice(product.price)}
        </span>
        <span className="text-xs font-medium text-primary transition-transform group-hover:translate-x-1">
          Voir sur la boutique →
        </span>
      </div>
    </a>
  )
}
