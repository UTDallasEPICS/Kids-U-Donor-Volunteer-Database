import MainSidebar from "./components/MainSidebar";
import "./globals.css";

export const metadata = {
  title: "KIDSU Donor Volunteer Database",
  description: "Next.js application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex">
        <MainSidebar />
        <div className="flex-grow">{children}</div>
      </body>
    </html>
  );
}
