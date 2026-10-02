import { redirect } from 'next/navigation';

export default function FafCommunicationsRedirectPage() {
  redirect('/comunicados?tab=faf');
}
