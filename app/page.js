import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/page/home');
  return null;
}
