import { withContentlayer } from 'next-contentlayer'

export default withContentlayer({
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  }
})