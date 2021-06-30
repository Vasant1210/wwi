import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core'; 
import { ChatParticipantStatus } from '../core/chat-participant-status';
import { chatParticipantStatusDescriptor } from '../core/chat-participant-status-descriptor';
import { ScrollDirection } from '../core/scroll-direction.enum';
import { MessageCounter } from '../core/message-counter';
import { MessageType } from '../core/message-type';
import { BusinessCardService } from '../../_services/business-card.service';
import { Localization } from '../core/localization';
import { Message } from '../core/message';
import { IChatOption } from '../core/chat-option';
import { ChatParticipantType } from '../core/chat-participant-type';
import { Window } from '../core/window';
import { IFileUploadAdapter } from '../core/file-upload-adapter';
import { NotificationService } from '../../_services/notification.service';
import { AuthenticationService } from '../../_services';

@Component({
  selector: 'app-xchat-window',
  templateUrl: './xchat-window.component.html',
  styleUrls: ['./xchat-window.component.css']
})
export class XchatWindowComponent  {
 
  @Input() fileUploadAdapter: IFileUploadAdapter;
  @Input() window: Window
  @Input() userId: any;
  @Input() localization: Localization;
  @Input() showOptions: boolean;
  @Input()  emojisEnabled: boolean;
  @Input() linkfyEnabled: boolean;
  @Input() showMessageDate: boolean;
  @Input() messageDatePipeFormat: string;
  @Input() hasPagedHistory: boolean;
  @Input() appUserId: any;
  @Output() onChatWindowClosed: EventEmitter<{
    closedWindow: Window;
    closedViaEscapeKey: boolean;
  }> = new EventEmitter();
  @Output() onMessagesSeen: EventEmitter<Message[]> = new EventEmitter();
@Output() onMessageSent: EventEmitter < Message >= new EventEmitter();
  @Output() onTabTriggered: EventEmitter<{
    triggeringWindow: Window;
    shiftKeyPressed: boolean;
  } > = new EventEmitter();;
  @Output() onOptionTriggered: EventEmitter<IChatOption> = new EventEmitter();
  @Output() onLoadHistoryTriggered: EventEmitter<Window> = new EventEmitter();

  @ViewChild('chatMessages', { static: false }) chatMessages: any;
  @ViewChild('nativeFileInput') nativeFileInput: ElementRef
  @ViewChild('chatWindowInput') chatWindowInput: any
  businessCardActionInit = false;
  canSend:boolean=true;
  canRequest: boolean = true;
  constructor(private notificationService: NotificationService, private authenticationService: AuthenticationService) {
  }
  
  fileUploadersInUse: string[];

  // Exposes enums and functions for the ng-template
  get ChatParticipantStatus() {
    return ChatParticipantStatus;
  }
  get chatParticipantStatusDescriptor() {
    return chatParticipantStatusDescriptor;
  }
  get MessageType() {
    return MessageType;
  }
  get ChatParticipantType() {
    return ChatParticipantType;
  }
  defaultWindowOptions(currentWindow) {
    if (this.showOptions && currentWindow.participant.participantType == ChatParticipantType.User) {
      return [{
        isActive: false,
        chattingTo: currentWindow,
        validateContext: (participant) => {
          return participant.participantType == ChatParticipantType.User;
        },
        displayLabel: 'Add People' // TODO: Localize this
      }];
    }
    return [];
  }
  // Asserts if a user avatar is visible in a chat cluster
  isAvatarVisible(window, message, index) {
    if (message.fromId != this.userId) {
      if (index == 0) {
        return true; // First message, good to show the thumbnail
      }
      else {
        // Check if the previous message belongs to the same user, if it belongs there is no need to show the avatar again to form the message cluster
        if (window.messages[index - 1].fromId != message.fromId) {
          return true;
        }
      }
    }
    return false;
  }
  getChatWindowAvatar(participant, message) {
    if (participant.participantType == ChatParticipantType.User) {
      return participant.avatar;
    }
    else if (participant.participantType == ChatParticipantType.Group) {
      let group = participant;
      let userIndex = group.chattingTo.findIndex(x => x.id == message.fromId);
      return group.chattingTo[userIndex >= 0 ? userIndex : 0].avatar;
    }
    return null;
  }
  isUploadingFile(window) {
    const fileUploadInstanceId = this.getUniqueFileUploadInstanceId(window);
    return this.fileUploadersInUse.indexOf(fileUploadInstanceId) > -1;
  }
  // Generates a unique file uploader id for each participant
  getUniqueFileUploadInstanceId(window) {
    if (window && window.participant) {
      return `ng-chat-file-upload-${window.participant.id}`;
    }
    return 'ng-chat-file-upload';
  }
  unreadMessagesTotal(window) {
    return MessageCounter.unreadMessagesTotal(window, this.userId);
  }
  // Scrolls a chat window message flow to the bottom
  scrollChatWindow(window, direction) {
    if (!window.isCollapsed) {
      setTimeout(() => {
        if (this.chatMessages) {
          let element = this.chatMessages.nativeElement;
          let position = (direction === ScrollDirection.Top) ? 0 : element.scrollHeight;
          element.scrollTop = position;
        }
      });
    }
  }
  activeOptionTrackerChange(option) {
    this.onOptionTriggered.emit(option);
  }
  // Triggers native file upload for file selection from the user
  triggerNativeFileUpload(window) {
    if (window) {
      if (this.nativeFileInput)
        this.nativeFileInput.nativeElement.click();
    }
  }
  // Toggles a window focus on the focus/blur of a 'newMessage' input
  toggleWindowFocus(window) {
    window.hasFocus = !window.hasFocus;
    if (window.hasFocus) {
      const unreadMessages = window.messages
        .filter(message => message.dateSeen == null
          && (message.toId == this.userId || window.participant.participantType === ChatParticipantType.Group));
      if (unreadMessages && unreadMessages.length > 0) {
        this.onMessagesSeen.emit(unreadMessages);
      }
    }
  }
  markMessagesAsRead(messages) {
    this.onMessagesSeen.emit(messages);
  }
  fetchMessageHistory(window) {
    this.onLoadHistoryTriggered.emit(window);
  }
  // Closes a chat window via the close 'X' button
  onCloseChatWindow() {
    this.onChatWindowClosed.emit({ closedWindow: this.window, closedViaEscapeKey: false });
  }
  /*  Monitors pressed keys on a chat window
      - Dispatches a message when the ENTER key is pressed
      - Tabs between windows on TAB or SHIFT + TAB
      - Closes the current focused window on ESC
  */
  onChatInputTyped(event, window) {
    switch (event.keyCode) {
      case 13:
        this.onChatEnterButton(window);
        break;
      case 9:
        event.preventDefault();
        this.onTabTriggered.emit({ triggeringWindow: window, shiftKeyPressed: event.shiftKey });
        break;
      case 27:
        this.onChatWindowClosed.emit({ closedWindow: window, closedViaEscapeKey: true });
        break;
    }
  }

  onChatEnterButton(window) {
    if (window.newMessage && window.newMessage.trim() != "") {
      let message = new Message();
      message.fromId = this.userId;
      message.toId = window.participant.id;
      message.message = window.newMessage;
      message.dateSent = new Date();
      window.messages.push(message);
      this.onMessageSent.emit(message);
      window.newMessage = ""; // Resets the new message input
      //kanika
      this.scrollChatWindow(window, ScrollDirection.Bottom);
    }
  }

  // Toggles a chat window visibility between maximized/minimized
  onChatWindowClicked(window) {
    window.isCollapsed = !window.isCollapsed;
    this.scrollChatWindow(window, ScrollDirection.Bottom);
  }

  clearInUseFileUploader(fileUploadInstanceId) {
    const uploaderInstanceIdIndex = this.fileUploadersInUse.indexOf(fileUploadInstanceId);
    if (uploaderInstanceIdIndex > -1) {
      this.fileUploadersInUse.splice(uploaderInstanceIdIndex, 1);
    }
  }
  // Handles file selection and uploads the selected file using the file upload adapter
  onFileChosen(window) {
    const fileUploadInstanceId = this.getUniqueFileUploadInstanceId(window);
    const uploadElementRef = this.nativeFileInput;
    if (uploadElementRef) {
      const file = uploadElementRef.nativeElement.files[0];
      this.fileUploadersInUse.push(fileUploadInstanceId);
      this.fileUploadAdapter.uploadFile(file, window.participant.id)
        .subscribe(fileMessage => {
          this.clearInUseFileUploader(fileUploadInstanceId);
          fileMessage.fromId = this.userId;
          // Push file message to current user window   
          window.messages.push(fileMessage);
          this.onMessageSent.emit(fileMessage);
          this.scrollChatWindow(window, ScrollDirection.Bottom);
          // Resets the file upload element
          uploadElementRef.nativeElement.value = '';
        }, (error) => {
          this.clearInUseFileUploader(fileUploadInstanceId);
          // Resets the file upload element
          uploadElementRef.nativeElement.value = '';
          // TODO: Invoke a file upload adapter error here
        });
    }
  }
  openBusinessCardActionTab(window) {
    let hasAlreadySent = this.window.messages.find(x => x.type.valueOf() == MessageType.BCardSent.valueOf() && x.fromId == this.userId  );
    if (hasAlreadySent) {       
        this.canSend=false; 
    }
    let hasAlreadyRequested = this.window.messages.find(x => x.type.valueOf() == MessageType.BCardRequested.valueOf() &&  x.fromId == this.userId);
    if (hasAlreadyRequested) {
      this.canRequest=false;
    }
    let hasAlreadyReceived = this.window.messages.find(x => x.type.valueOf() == MessageType.BCardSent.valueOf() && x.fromId != this.userId);
    if (hasAlreadyReceived) {
      this.canRequest = false;
    }
    this.businessCardActionInit = true;
  }
  cancelBusinessCardAction() {
    this.businessCardActionInit = false;
  }
  requestBusinessCard(window) {
    let hasAlreadySent = this.window.messages.find(x => x.type.valueOf() == MessageType.BCardRequested.valueOf() &&  x.fromId == this.userId);
    if (!hasAlreadySent) {
      let message = new Message();
      message.fromId = this.userId;
      message.toId = window.participant.id;
      message.message = "Request for business card sent";
      message.dateSent = new Date();
      message.type = MessageType.BCardRequested.valueOf();
      window.messages.push(message);
      this.onMessageSent.emit(message);
      window.newMessage = ""; // Resets the new message input
      //kanika
    }
    this.scrollChatWindow(window, ScrollDirection.Bottom);
    this.businessCardActionInit = false;
  }
  sendBusinessCard(window) {
    let hasAlreadySent = this.window.messages.find(x => x.type.valueOf() == MessageType.BCardSent.valueOf() && x.fromId == this.userId  );
    if (!hasAlreadySent) {
      let message = new Message();
      message.fromId = this.userId;
      message.toId = window.participant.id;
      message.message = "Business card sent successfully";
      message.dateSent = new Date();
      message.type = MessageType.BCardSent.valueOf();
      window.messages.push(message);
      this.onMessageSent.emit(message);
      window.newMessage = ""; // Resets the new message input
      //kanika
    }
    this.scrollChatWindow(window, ScrollDirection.Bottom);
    this.businessCardActionInit = false;
  }
  approveBusinessCard(window) {
    this.sendBusinessCard(window);
    if (this.authenticationService.currentUserValue) {
      this.notificationService.businessCardRequestApproved(this.authenticationService.currentUserValue.webcast_id, window.participant.id);
    }
  }
  CanApproveBusinessCard() {
    let hasAlreadySent = this.window.messages.find(x => x.type.valueOf() == MessageType.BCardSent.valueOf() && x.fromId == this.userId);
    if (hasAlreadySent) {
      return false;
    }
    return true;
  }

}
