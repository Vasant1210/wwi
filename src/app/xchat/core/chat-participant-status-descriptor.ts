import { ChatParticipantStatus } from './chat-participant-status';

export function chatParticipantStatusDescriptor(status, localization) {
  var currentStatus = ChatParticipantStatus[status].toString().toLowerCase();
  return localization.statusDescription[currentStatus];
}
