import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import ChatFab from '../components/ui/chat-fab';
import './globals.css';

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Mohammed Hilman Trihatmojo - Fullstack Developer',
  description: 'Personal website and blog of Mohammed Hilman Trihatmojo, a fullstack developer.',
  generator: 'Mohammed Hilman Trihatmojo - Fullstack Developer',
  icons: {
    icon: [
      {
        url: '/javierdimastri-bulat.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/javierdimastri-bulat.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/javierdimastri-bulat.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/javierdimastri-bulat.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <ChatFab />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
