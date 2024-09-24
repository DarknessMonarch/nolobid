import '@/app/styles/global.css';
import { Inter } from 'next/font/google';
import toast, { Toaster } from "react-hot-toast";


const inter = Inter({ weight: ['400', '500', '600', '700'], subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL('https://nolobid.com/'),
  title: 'Nolobid - The Ultimate Bidding Platform',
  applicationName: 'Nolobid',
  author: 'DarknessMonarch',
  images:
    "https://raw.githubusercontent.com/Nolojia-Technologies/nolobids/master/src/assets/banner.png",
  description: 'Nolobid is an all-in-one bidding platform where you can win desired items at the lowest possible prices, offering a seamless online auction experience with unbeatable deals.',
  metadataBase: new URL("https://www.nolobid.com/"),
  keywords: ['Bidding platfor',
    'Online auctions',
    'Lowest price bids',
    'Best deals',
    'Win items online',
    'Competitive bidding',
    'Affordable prices',
    'Auction site',
    'Secure bidding',
    'Buy at low prices'],

  // OG meta tags
  openGraph: {
    title: 'Nolobid - The Ultimate Bidding Platform',
    description: 'Nolobid is an all-in-one bidding platform where you can win desired items at the lowest possible prices, offering a seamless online auction experience with unbeatable deals.',
    url: 'https://nolobid.com/',
    siteName: 'Nolobid',
    images:
      "https://raw.githubusercontent.com/Nolojia-Technologies/nolobids/master/src/assets/banner.png",

  },

  //  robots txt
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

};




export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body>
        <div className={inter.className}>
          {children}
        </div>
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            className: '',
            duration: 8000,
            style: {
              background: '#161C45',
              color: '#ffffff',
            }
          }}
        />
      </body>
    </html>
  );
}
