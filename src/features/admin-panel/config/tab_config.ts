import { FC, lazy, LazyExoticComponent } from "react";

export interface TabComponentProps {
  editId?: string;
}

const TabComponents = {
  home: lazy(() => import("../components/tab-pages/home")),
  "create-blog": lazy(() => import("../components/tab-pages/create_new_blog")),
  "all-blog": lazy(() => import("../components/tab-pages/all_blogs")),
  "section-list": lazy(() => import("../components/tab-pages/section_list")),
  me: lazy(() => import("../components/tab-pages/Account")),
  "author-approvals": lazy(
    () => import("../components/tab-pages/author_approvals")
  ),
  "newsletter-subscribers": lazy(
    () => import("../components/tab-pages/newsletter_subscribers")
  ),
  "ads-management": lazy(
    () => import("../components/tab-pages/ads_management")
  ),
  backup: lazy(() => import("../components/tab-pages/backup")),
} satisfies Record<string, LazyExoticComponent<FC<TabComponentProps>>>;

export type TabKey = keyof typeof TabComponents;
export const VALID_TABS = Object.keys(TabComponents) as TabKey[];

export const TabMetadata: Record<TabKey, { label: string; icon?: string }> = {
  home: { label: "Home", icon: "🏠" },
  "create-blog": { label: "Create", icon: "✏️" },
  "all-blog": { label: "Blogs", icon: "📚" },
  "section-list": { label: "Sections", icon: "📋" },
  me: { label: "Me", icon: "👤" },
  "author-approvals": { label: "Approvals", icon: "✅" },
  "newsletter-subscribers": { label: "Newsletter", icon: "📧" },
  "ads-management": { label: "Ads", icon: "📢" },
  backup: { label: "Backup", icon: "💾" },
};

export default TabComponents;
