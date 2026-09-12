import { AboutEditor } from "@/components/admin/forms/about-editor";
import {
  getAdminCoreValues,
  getAdminSection,
  getAdminTeam,
  getAdminTimeline,
} from "@/lib/data/queries";

export default async function AdminAboutPage() {
  const [introduction, vision, mission, coreValues, timeline, team] =
    await Promise.all([
      getAdminSection("about", "introduction"),
      getAdminSection("about", "vision"),
      getAdminSection("about", "mission"),
      getAdminCoreValues(),
      getAdminTimeline(),
      getAdminTeam(),
    ]);

  return (
    <AboutEditor
      introduction={introduction}
      vision={vision}
      mission={mission}
      coreValues={coreValues}
      timeline={timeline}
      team={team}
    />
  );
}
