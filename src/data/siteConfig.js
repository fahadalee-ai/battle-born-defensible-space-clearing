/**
 * Single source of truth for details the client must confirm.
 * Replace every value marked "client to confirm" before launch.
 * Do not invent phone numbers, addresses, license numbers, prices, or counties.
 */
export const siteConfig = {
  businessName: "Battle Born Defensible Space Clearing LLC",
  shortName: "Battle Born",
  tagline: "Clear the fuel. Protect what matters.",
  description:
    "Defensible space clearing, mastication, and hand thinning to reduce wildfire fuel around homes, businesses, and communities.",
  phoneDisplay: "[Phone — client to confirm]",
  phoneTel: "",
  email: "[Email — client to confirm]",
  address: "[Street address — client to confirm]",
  cityLine: "[City, NV — client to confirm]",
  hours: [
    { days: "Monday – Friday", time: "[Hours — client to confirm]" },
    { days: "Saturday", time: "[Hours — client to confirm]" },
    { days: "Sunday", time: "Closed" },
  ],
  serviceAreas: [
    { name: "[Primary county — client to confirm]", places: "[Cities — client to confirm]" },
    { name: "[Additional county — client to confirm]", places: "[Cities — client to confirm]" },
    { name: "[Additional county — client to confirm]", places: "[Cities — client to confirm]" },
  ],
  licenseLabel: "License — client to confirm",
  insuranceLabel: "Insurance — client to confirm",
  socials: [
    { name: "Facebook", url: "" },
    { name: "Instagram", url: "" },
  ],
  sampleAddresses: [
    "1200 Foothill Road, Sample City, NV",
    "45 Sagebrush Lane, Sample City, NV",
    "800 Industrial Way, Sample City, NV",
    "12 Greenbelt Court, Sample City, NV",
  ],
  /** Dates the crew does not book. Sundays are also blocked in the calendar. */
  blockedDates: ["2026-12-25"],
  pricingNote: "Free on-site estimate. Pricing depends on acreage, terrain, and vegetation density.",
  quoteValidityNote: "[Validity date — set when a real quote is issued]",
  responseTime: "We typically follow up within one business day. [Response time — client to confirm]",
  demo: {
    email: "jordan@example.com",
    password: "password",
    otp: "482913",
  },
};

export function isPlaceholder(value) {
  if (!value) return true;
  const v = String(value).toLowerCase();
  return v.includes("client to confirm") || v.includes("[") || v.includes("sample");
}
