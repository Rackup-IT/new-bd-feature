"use client";

import {
  TabMetadata,
  VALID_TABS,
} from "@/features/admin-panel/config/tab_config";
import { cn } from "../../../utils/utils";
import TabLink from "../components/tab_link";
import { useSessionQuery } from "../services/session-service";

// small presentational helper: fallback icon bubble
const IconBubble: React.FC<{ icon?: string }> = ({ icon }) => (
  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm text-sm">
    <span>{icon ?? "🔗"}</span>
  </div>
);

interface DashboardSideBarProps {
  className?: string;
}

const DashboardSideBar: React.FC<DashboardSideBarProps> = (props) => {
  const { data: sessionResponse, isLoading, isError } = useSessionQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !sessionResponse?.session) {
    return <div>Error loading session</div>;
  }

  const { session } = sessionResponse;

  const filteredTabs = VALID_TABS.filter((tab) => {
    if (tab === "author-approvals") {
      console.log("ROOT USER IS : " + session.isRootUser);
      return !!session?.isRootUser;
    }
    return true;
  });

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 bg-gray-100 rounded-4xl p-3",
        props.className
      )}
    >
      {filteredTabs.map((tab) => (
        <TabLink
          tabkey={tab}
          key={tab}
          className="bg-transparent hover:shadow-md hover:bg-white"
          activeClassName="bg-white shadow-lg"
        >
          <div className="flex flex-col items-center gap-3">
            <IconBubble icon={TabMetadata[tab].icon} />
            <div className="flex flex-col">
              <span className="text-xs  text-gray-800">
                {TabMetadata[tab].label}
              </span>
            </div>
          </div>
        </TabLink>
      ))}
    </div>
  );
};

export default DashboardSideBar;
