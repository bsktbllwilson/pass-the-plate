import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pass The Plate — Marketplace for Asian F&B Businesses',
  description: 'The first marketplace for the $240B+ Asian F&B business transition.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/cub1hgl.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
