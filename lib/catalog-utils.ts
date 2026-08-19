const LEGACY_FRAGRANCE_TERMS = [
  'عطر',
  'عطور',
  'بخور',
  'perfume',
  'parfum',
  'fragrance',
  'musk',
  'مسك',
  'oud',
]

function containsLegacyFragranceTerm(value: unknown) {
  return typeof value === 'string' && LEGACY_FRAGRANCE_TERMS.some((term) => value.toLowerCase().includes(term))
}

export function isLegacyCatalogRecord(record: {
  name?: string | null
  slug?: string | null
  brand?: string | null
  description?: string | null
  category?: string | null
}) {
  return [record.name, record.slug, record.brand, record.description, record.category].some(containsLegacyFragranceTerm)
}

export function isLegacyCollectionRecord(record: {
  name?: string | null
  slug?: string | null
  description?: string | null
}) {
  return [record.name, record.slug, record.description].some(containsLegacyFragranceTerm)
}
