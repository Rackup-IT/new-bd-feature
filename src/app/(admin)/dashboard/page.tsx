import React, { Suspense } from "react";
import { TabProvider } from "../../../features/admin-panel/components/tab_context";
import TabComponents, {
  TabKey,
  VALID_TABS,
} from "../../../features/admin-panel/config/tab_config";
import { getSession } from "../../../lib/session";
import { getSingleParam } from "../../../utils/params";

interface AdminDashboardProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
const AdminDashboard: React.FC<AdminDashboardProps> = async ({
  searchParams,
}: AdminDashboardProps) => {
  const resolvedSearchParams = await searchParams;

  const session = await getSession();
  const isRootUser = !!session?.isRootUser;

  const allowedForNonRoot: TabKey[] = ["create-blog", "me"];
  const availableTabs = isRootUser ? VALID_TABS : allowedForNonRoot;
  const defaultTab: TabKey = isRootUser ? "home" : allowedForNonRoot[0];

  const tabParam = getSingleParam(resolvedSearchParams.tab, defaultTab);
  const editId = getSingleParam(resolvedSearchParams.editId);

  const currentTab: TabKey = availableTabs.includes(tabParam as TabKey)
    ? (tabParam as TabKey)
    : defaultTab;

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
