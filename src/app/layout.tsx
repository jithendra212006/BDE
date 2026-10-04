import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'StreamInsight | OTT Platform Analytics',
  description: 'Clean, modern analytics dashboard for OTT streaming platforms.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0D0F14] text-gray-100 flex h-screen overflow-hidden antialiased selection:bg-red-500/20 selection:text-white">
        {/* Compact Navigation Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-10 sm:py-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
