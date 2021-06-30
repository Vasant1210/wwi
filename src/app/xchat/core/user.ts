import { ChatParticipantStatus } from "./chat-participant-status";
import { IChatParticipant } from "./chat-participant";
import { ChatParticipantType } from "./chat-participant-type";
export class User implements IChatParticipant {
    readonly participantType: ChatParticipantType;
    id: any;
    displayName: string;
    status: ChatParticipantStatus;
     avatar: string;
  hasUnreadMessage: number;
  socketId: string;
    constructor() {
      this.participantType = ChatParticipantType.User;
      this.hasUnreadMessage = 0;
    }
}
