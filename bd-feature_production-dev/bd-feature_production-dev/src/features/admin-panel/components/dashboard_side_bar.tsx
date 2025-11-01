"use client";

import {
  TabKey,
  TabMetadata,
  VALID_TABS,
} from "@/features/admin-panel/config/tab_config";
import { cn } from "../../../utils/utils";
import TabLink from "../components/tab_link";
import { useSessionQuery } from "../services/session-service";

// small presentational helper: fallback icon bubble
const IconBubble: React.FC<{ icon?: string; isActive?: boolean }> = ({
  icon,
  isActive,
}) => (
  <div
    className={cn(
      "w-10 h-10 flex items-center justify-center rounded-2xl border text-base transition-colors",
      isActive
        ? "bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white border-amber-400"
        : "bg-white/80 border-white/60 text-amber-500"
    )}
  >
    <span className="drop-shadow-sm">{icon ?? "🔗"}</span>
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

  const allowedForNonRoot: TabKey[] = ["create-blog", "me"];

  const filteredTabs = VALID_TABS.filter((tab) => {
    if (session.isRootUser) {
      return true;
    }

    return allowedForNonRoot.includes(tab);
  });

  return (
    <nav
      className={cn(
        "flex flex-col items-stretch gap-3 bg-gray-200 border border-white/60 shadow-xl rounded-4xl p-4 backdrop-blur-sm",
        props.className
      )}
    >
      {filteredTabs.map((tab) => (
        <TabLink
          tabkey={tab}
          key={tab}
          className="group relative px-3 py-2"
          activeClassName=""
        >
          {({ isActive }: { isActive: boolean }) => (
            <div
              className={cn(
                "flex flex-col items-center gap-2 rounded-3xl border border-transparent px-2 py-3 transition-all duration-200",
                isActive
                  ? "border-amber-200"
                  : "bg-transparent"
              )}
            >
              <IconBubble icon={TabMetadata[tab].icon} isActive={isActive} />
              <span
                className={cn(
                  "text-xs font-semibold tracking-wide transition-colors",
                  isActive ? "text-gray-900" : "text-gray-600 group-hover:text-gray-900"
                )}
              >
                {TabMetadata[tab].label}
              </span>
            </div>
          )}
        </TabLink>
      ))}
    </nav>
  );
};

export default DashboardSideBar;
