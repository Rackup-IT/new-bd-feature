import React, { Suspense } from "react";
import { TabProvider } from "../../../features/admin-panel/components/tab_context";
import TabComponents, {
  TabKey,
  VALID_TABS,
} from "../../../features/admin-panel/config/tab_config";
import { getSingleParam } from "../../../utils/params";

interface AdminDashboardProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
const AdminDashboard: React.FC<AdminDashboardProps> = async ({
  searchParams,
}: AdminDashboardProps) => {
  const resolvedSearchParams = await searchParams;
  const tabParam = getSingleParam(resolvedSearchParams.tab, "home");
  const editId = getSingleParam(resolvedSearchParams.editId);

  const currentTab: TabKey = VALID_TABS.includes(tabParam as TabKey)
    ? (tabParam as TabKey)
    : "home";

  const TabComponent = TabComponents[
    currentTab
  ] as unknown as React.ComponentType<{
    editId?: string;
  }>;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TabProvider>
        <TabComponent editId={editId} />
      </TabProvider>
    </Suspense>
  );
};
export default AdminDashboard;
