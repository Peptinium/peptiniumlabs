// Server-only helpers shared by admin payment functions.

export function validatePaymentLink(link: string): string {
  const trimmed = (link ?? "").trim();
  if (!trimmed) throw new Error("Lien de paiement vide.");
  if (trimmed.length > 2000) throw new Error("Lien trop long.");
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error("Lien invalide.");
  }
  if (url.protocol !== "https:") {
    throw new Error("Le lien doit commencer par https://");
  }
  return trimmed;
}

export function buildShippingAddress(o: {
  address_line: string;
  postal_code: string;
  city: string;
  country: string;
}): string {
  return [o.address_line, `${o.postal_code} ${o.city}`, o.country]
    .filter(Boolean)
    .join("\n");
}

export function buildTrackingUrl(carrier: string, tracking: string): string {
  const c = carrier.toLowerCase().trim();
  const t = encodeURIComponent(tracking.trim());
  if (c.includes("colissimo") || c.includes("la poste") || c.includes("laposte"))
    return `https://www.laposte.fr/outils/suivre-vos-envois?code=${t}`;
  if (c.includes("chronopost"))
    return `https://www.chronopost.fr/tracking-no-cms/suivi-page?listeNumerosLT=${t}`;
  if (c.includes("mondial"))
    return `https://www.mondialrelay.fr/suivi-de-colis?numeroExpedition=${t}`;
  if (c.includes("dhl"))
    return `https://www.dhl.com/fr-fr/home/tracking.html?tracking-id=${t}`;
  if (c.includes("ups")) return `https://www.ups.com/track?tracknum=${t}`;
  if (c.includes("fedex")) return `https://www.fedex.com/fedextrack/?trknbr=${t}`;
  if (c.includes("dpd")) return `https://www.dpd.fr/tracex_${t}`;
  if (c.includes("gls"))
    return `https://gls-group.com/FR/fr/suivi-colis?match=${t}`;
  if (c.includes("tnt"))
    return `https://www.tnt.com/express/fr_fr/site/shipping-tools/tracking.html?searchType=con&cons=${t}`;
  return `https://www.google.com/search?q=${encodeURIComponent(
    carrier + " suivi " + tracking,
  )}`;
}
