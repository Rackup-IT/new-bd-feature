import { cn } from "@/utils/utils";
import { headers } from "next/headers";
import { Suspense } from "react";
import Provider from "../../components/provider/provider";
import SidePanel from "../../features/admin-panel/components/dashboard_side_bar";

import "./globals.css";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = async (props) => {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "";

  return (
    <html>
      <Provider>
        <body>
          <div id="backdrop" />
          <div id="overlay" />
          <div
            className={cn(
              (pathname.startsWith("/dashboard") ||
                pathname.startsWith("/admin")) &&
              "grid grid-cols-[120px_1fr] gap-5 h-screen w-screen"
            )}
          >
            <Suspense fallback={<div>Loading...</div>}>
              {/* Side Panel  */}
              {(pathname.startsWith("/dashboard") ||
                pathname.startsWith("/admin")) && (
                  <div className="p-5 h-screen w-full flex flex-col overflow-hidden">
                    <div className="w-full font-bold text-base text-center flex-shrink-0 mb-10">
                      Logo
                    </div>
                    <div className="flex-1 min-h-0 sidebar-scroll relative">
                      <SidePanel className="" />
                    </div>
                  </div>
                )}

              {/* Dashboard Body  */}
              <div
                className={cn(
                  (pathname.startsWith("/dashboard") ||
                    pathname.startsWith("/admin")) &&
                  "p-5 h-full w-full overflow-hidden"
                )}
              >
                {props.children}
              </div>
            </Suspense>
          </div>
        </body>
      </Provider>
    </html>
  );
};

export default AdminLayout;
