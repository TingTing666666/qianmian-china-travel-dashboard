import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "大模型分析 - 千面中国游",
  description: "AI驱动的数据分析和智能助手",
}

export default function AIPage() {
  // 重定向到千面大模型助手页面
  redirect("/ai/assistant")
}