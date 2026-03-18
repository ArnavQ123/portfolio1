import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Arnav Khandelwal | Portfolio',
  description: 'Arnav Khandelwal – Computer Science Student & Data Science Enthusiast. Portfolio showcasing projects, skills, and achievements.',
  charset: 'utf-8',
  viewport: 'width=device-width, initial-scale=1.0',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-bg-primary text-text-primary">
        {children}
      </body>
    </html>
  )
}
