import "./globals.css";

export const metadata = {
  title: "Company Policy Assistant",
  description: "Comparison of policy retrieval approaches",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
