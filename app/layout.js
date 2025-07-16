import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect } from 'react';
import { supabase } from '../supabaseClient';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
export const metadata = {
  title: "TPC",
};

export default function RootLayout({ children }) {
  useEffect(() => {
    const linkSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const user = session.user;
      const normalizedEmail = user.email.trim().toLowerCase();

      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('email', normalizedEmail)
        .is('user_id', null)
        .maybeSingle();

      if (subData) {
        await supabase
          .from('subscriptions')
          .update({ user_id: user.id })
          .eq('email', normalizedEmail)
          .is('user_id', null);
        console.log('Global: Linked subscription for', normalizedEmail);
      }
    };
    linkSubscription();
  }, []);

  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
