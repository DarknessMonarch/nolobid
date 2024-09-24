export default function manifest() {
    return {
      name: 'Nolobid',
      short_name: 'Nolobid',
      description: 'Nolobid is an all-in-one bidding platform where you can win desired items at the lowest possible prices, offering a seamless online auction experience with unbeatable deals.',
      start_url: '/' || '/page/home',
      display: 'standalone',
      background_color: '#00062C',
      theme_color: '#00062C',
      icons: [
        {
          src: '/favicon.ico',
          sizes: 'any',
          type: 'image/x-icon',
        },
      ],
    }
  }