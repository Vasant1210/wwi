import { ChatParticipantStatus } from "./chat-participant-status";
import { ChatParticipantType } from "./chat-participant-type";
export interface IChatParticipant {
    readonly participantType: ChatParticipantType;
    readonly id: any;
    readonly status: ChatParticipantStatus;
    readonly avatar: string | null;
    readonly displayName: string;
  hasUnreadMessage: number;
  socketId: string|null;
}
