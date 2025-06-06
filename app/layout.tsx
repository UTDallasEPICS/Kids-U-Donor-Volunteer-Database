import MainSidebar from "./components/main-sidebar";
import "./globals.css";
import TopNavigationBar from "./components/admin-top-navigation-bar";

export const metadata = {
  title: "KIDSU Donor Volunteer Database",
  description: "Next.js application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col items-center">
        

        <div className="flex w-full">
          
          <div className="flex flex-col flex-grow">
            <main className="flex-grow">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
