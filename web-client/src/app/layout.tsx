import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ApolloProvider } from '@/components/providers/ApolloProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <ApolloProvider>
          <AuthProvider>{children}</AuthProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
