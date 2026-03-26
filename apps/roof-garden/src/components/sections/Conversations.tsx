import { LandingConversations } from "@repo/ui";
import { conversationsData } from "@/data/roof-garden";

export function Conversations() {
  return <LandingConversations {...conversationsData} />;
}
