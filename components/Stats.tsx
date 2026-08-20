type StatsData = {
  statsJson?: string | null
}

/**
 * The homepage stats strip is intentionally hidden from the storefront.
 * The data contract remains intact so existing admin settings are preserved.
 */
export default function Stats(_props: { data?: StatsData }) {
  return null
}
