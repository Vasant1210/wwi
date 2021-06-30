import { Observable } from 'rxjs';
import { IChatParticipant } from './chat-participant';
import { Message } from "./message";
import { ParticipantResponse } from './participant-response';


export abstract class ChatAdapter {
    abstract listFriends(): Observable<ParticipantResponse[]>;
    abstract getConversations(): Observable<ParticipantResponse[]>;
    abstract getMessageHistory(destinataryId: any): Observable<Message[]>;
    abstract sendMessage(message: Message): void;
    //onFriendsListChanged(participantsResponse: ParticipantResponse[]): void;
    //onMessageReceived(participant: IChatParticipant, message: Message): void;
    /** @internal */
    friendsListChangedHandler: (participantsResponse: ParticipantResponse[]) => void;
    /** @internal */
  messageReceivedHandler: (participant: IChatParticipant, message: Message) => void;
      constructor() {
        // ### Abstract adapter methods ###
        // Event handlers
        /** @internal */
        this.friendsListChangedHandler = (participantsResponse) => { };
        /** @internal */
        this.messageReceivedHandler = (participant, message) => { };
      }
      // ### Adapter/Chat income/ingress events ###
      onFriendsListChanged(participantsResponse) {
        this.friendsListChangedHandler(participantsResponse);
      }
      onMessageReceived(participant, message) {
        this.messageReceivedHandler(participant, message);
      }
}
