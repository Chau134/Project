import "bootstrap/dist/css/bootstrap.min.css";
import Providers from "./providers";
import MyNavbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={"${inter.className} antialiased"}>
        <MyNavbar></MyNavbar>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
