// @ts-check
/** @type {import('next-seo').DefaultSeoProps} */
export default {
  titleTemplate: '%s | Sushi',
  title: 'Sushi Analytics',
  defaultTitle: 'Sushi Analytics',
  description: 'Analytics platform for tracking the liquidity of Sushi products.',
  //   canonical: 'https://sushi.com/analytics',
  //   mobileAlternate: {
  //     media: '',
  //     href: '',
  //   },
  //   languageAlternates: [{ hrefLang: "en", href: "https://sushi.com/analytics" }],
  twitter: {
    handle: '@sushiswap',
    site: '@sushiswap',
    cardType: 'summary_large_image',
  },
  openGraph: {
    url: 'https://www.sushi.com/analytics',
    type: 'website',
    title: 'Sushi Analytics',
    description: 'Analytics platform for tracking the liquidity of Sushi products.',
    images: [
      {
        url: 'https://www.sushi.com/analytics/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sushi Analytics',
      },
    ],
    // videos: [],
    // locale: 'en_IE',
    site_name: 'Sushi',
  },
}
