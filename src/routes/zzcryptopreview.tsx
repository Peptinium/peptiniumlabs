import { createFileRoute } from "@tanstack/react-router";
import { CryptoPaymentBlock } from "./panier";
import { CartProvider, useCart } from "@/lib/cart";

export const Route = createFileRoute("/zzcryptopreview")({
  component: Preview,
  validateSearch: (s: Record<string, unknown>) => ({ st: String(s.st ?? "pending") }),
});

function Inner({ st }: { st: string }) {
  const cart = useCart();
  const intent: any = {
    orderId: "test-order",
    status: st,
    label: "USDC (Polygon)",
    unit: "USDC",
    network: "Polygon",
    walletAddress: "0x1111111111111111111111111111111111111111",
    paymentUri:
      "ethereum:0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174@137/transfer?address=0x1111111111111111111111111111111111111111&uint256=1.2345e6",
    amountCrypto: 1.2345,
    amountCryptoFormatted: "1.234500",
    amountEur: 118.9,
    expiresAt: new Date(Date.now() + 12 * 60 * 1000).toISOString(),
  };
  return (
    <CryptoPaymentBlock
      intent={intent}
      orderRef="PL-TEST-001"
      cart={cart}
      subtotal={115}
      shippingFee={3.9}
      total={118.9}
      onConfirmed={() => {}}
      onBack={() => {}}
    />
  );
}

function Preview() {
  const { st } = Route.useSearch();
  return (
    <CartProvider>
      <Inner st={st} />
    </CartProvider>
  );
}
