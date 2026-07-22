import { redirect } from "next/navigation";
import { defaultPlaybookSlug } from "@/lib/playbook";

export default function PlaybookIndexPage() {
  redirect(`/playbook/${defaultPlaybookSlug()}`);
}
