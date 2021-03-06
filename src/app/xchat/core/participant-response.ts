import { ParticipantMetadata } from "./participant-metadata";
import { IChatParticipant } from "./chat-participant";
export class ParticipantResponse {
    participant: IChatParticipant;
    metadata: ParticipantMetadata;
}
