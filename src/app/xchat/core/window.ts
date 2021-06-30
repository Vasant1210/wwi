import { Message } from "./message";
import { IChatParticipant } from "./chat-participant";
export  class Window {
  participant: IChatParticipant;
  messages: Message[];
  newMessage?: string;
  isCollapsed?: boolean;
  isLoadingHistory: boolean;
  hasFocus: boolean;
  hasMoreMessages: boolean;
  historyPage: number;
  constructor(participant: IChatParticipant, isLoadingHistory: boolean, isCollapsed: boolean) {
    this.messages = [];
    this.newMessage = "";
    // UI Behavior properties
    this.isCollapsed = false;
    this.isLoadingHistory = false;
    this.hasFocus = false;
    this.hasMoreMessages = true;
    this.historyPage = 0;
    this.participant = participant;
    this.messages = [];
    this.isLoadingHistory = isLoadingHistory;
    this.hasFocus = false; // This will be triggered when the 'newMessage' input gets the current focus
    this.isCollapsed = isCollapsed;
    this.hasMoreMessages = false;
    this.historyPage = 0;
  }
    
}
