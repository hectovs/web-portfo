/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/api/lifterscsv/:lifter*',
            destination: 'https://www.openpowerlifting.org/api/liftercsv/:lifter*',
          },
        ]
      },
}

module.exports = nextConfig
