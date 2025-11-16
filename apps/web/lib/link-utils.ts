export function getLinkDomain(): string {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
}

export function buildAffiliateLink(shortCode: string): string {
  const domain = getLinkDomain();
  return `${domain}/go/${shortCode}`;
}
