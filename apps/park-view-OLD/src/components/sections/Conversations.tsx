import { LandingConversations } from "@repo/ui";
import { conversationsData } from "@/data/park-view";

export function Conversations() {
  return <LandingConversations {...conversationsData} />;
}
