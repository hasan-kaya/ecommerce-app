import SiteLayout from '@/components/layout/SiteLayout/SiteLayout';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SiteLayout>{children}</SiteLayout>;
}
