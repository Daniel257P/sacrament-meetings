import type { Metadata } from "next";
import MeetingForm from "@/components/MeetingForm";

export const metadata: Metadata = {
  title: "Create Meeting",
};

export default function NewMeetingPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-3xl font-bold">Create Meeting</h1>
      {/* The form's action is wired to the createMeeting Server Action. */}
      <MeetingForm />
    </div>
  );
}
