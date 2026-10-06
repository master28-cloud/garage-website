import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import SettingsForm from "./SettingsForm";
import { getWhatsAppNumber } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const whatsapp = await getWhatsAppNumber();

  return (
    <AdminShell email={session.email}>
      <SettingsForm initial={whatsapp} />
    </AdminShell>
  );
}
