import MainSidebar from "./components/MainSidebar";
import "./globals.css";
import TopNavigationBar from "./components/TopNavigationBar";

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
        <div className="flex flex-col flex-grow">
          <TopNavigationBar />
          <main className="flex-grow">{children}</main>
        </div>
      </body>
    </html>
  );
}
  
