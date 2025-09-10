/*
 * @Date: 2025-09-09 13:56:35
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-09-10 09:20:51
 * @FilePath: \qianmian-china-travel-dashboard\src\config\site.ts
 */
export const siteConfig = {
    name: "千面中国游数据库",
    description: "中国旅游视频内容分析平台",
    url: "https://qianmian-china-travel.com",
    ogImage: "https://qianmian-china-travel.com/og.jpg",
    defaultRoute: "/dashboard",
    links: {
      github: "https://github.com/qianmian-travel/dashboard",
      docs: "https://docs.qianmian-china-travel.com",
    },
    creator: {
      name: "MrListen",
      url: "https://qianmian-china-travel.com",
    },
  }
  
  export type SiteConfig = typeof siteConfig