import { setRequestLocale } from "next-intl/server";
import { InsightsDashboard } from "@/components/admin/InsightsDashboard";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function InsightsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <InsightsDashboard />;
}
