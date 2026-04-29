export const BRAND_NAME = "Art by Dhruvangi";

export const BRAND_TAGLINE = "Handcrafted with love - Resin art, portraits & more";

export const BRAND_DESCRIPTION =
  "Professional resin art, portraits, paintings, jewellery, festive gifts, and handmade keepsakes by Dhruvangi.";

export const ART_CATEGORIES = [
  { name: "Jewellery", slug: "jewellery", accent: "#E8C97A" },
  { name: "Photo Frame", slug: "photo-frame", accent: "#F9C8D0" },
  { name: "Paintings", slug: "paintings", accent: "#C9B8E8" },
  { name: "Broche", slug: "broche", accent: "#A8D8C8" },
  { name: "Portrait", slug: "portrait", accent: "#FFBE98" },
  { name: "Rakhi", slug: "rakhi", accent: "#F9C8D0" },
  { name: "Diwali", slug: "diwali", accent: "#E8C97A" },
  { name: "Ring Platter", slug: "ring-platter", accent: "#C9B8E8" }
] as const;

export function categoryAccent(slug?: string | null) {
  return ART_CATEGORIES.find((category) => category.slug === slug)?.accent ?? "#F9C8D0";
}
