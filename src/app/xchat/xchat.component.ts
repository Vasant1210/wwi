import { Component, OnInit, ViewChild, Input, EventEmitter, Output, HostListener, ElementRef, QueryList, ViewChildren, OnChanges, SimpleChanges } from '@angular/core';
import { Message } from './core/message';
import { ParticipantResponse } from './core/participant-response';
import { IChatController } from './core/chat-controller';
import { ChatParticipantType } from './core/chat-participant-type';
import { Localization } from './core/localization';
import { Theme } from './core/theme';
import { IChatParticipant } from './core/chat-participant';
import { IChatOption } from './core/chat-option';
import { PagedHistoryChatAdapter } from './core/paged-history-chat-adapter';
import { Window } from './core/window';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../_services';
import { User } from '../_models';
import { SocketIOAdapter } from '../socketio-adapter';
import { io } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { XEventSocketService } from '../_services/x-event-socket.service';
import { ChatParticipantStatus } from './core/chat-participant-status';
import { DefaultFileUploadAdapter } from './core/default-file-upload-adapter';
import { map } from 'rxjs/operators';
import { ScrollDirection } from './core/scroll-direction.enum';
import { XchatWindowComponent } from './xchat-window/xchat-window.component';
import { BusinessCardService } from '../_services/business-card.service';
import { MessageType } from './core/message-type';
import { ChatAdapter } from './core/chat-adapter';
import { IFileUploadAdapter } from './core/file-upload-adapter';

@Component({
  selector: 'app-xchat',
  templateUrl: './xchat.component.html',
  styleUrls: ['./xchat.component.css']
})
export class XchatComponent implements OnInit, IChatController, OnChanges {
  currentUser: User;
  socketUserId: string;

  participantResponse: ParticipantResponse[];
  conversationResponse: ParticipantResponse[];
  conversist: IChatParticipant[];

  ChatParticipantType: typeof ChatParticipantType;
  ChatParticipantStatus: typeof ChatParticipantStatus;
  MessageType: typeof MessageType;
  private _isDisabled;
  private browserNotificationsBootstrapped;
  hasPagedHistory: boolean;
  private statusDescription;
  private audioFile;
  participants: IChatParticipant[];
  participantsResponse: ParticipantResponse[];
  participantsInteractedWith: IChatParticipant[];
  currentActiveOption: IChatOption | null;
  private pollingIntervalWindowInstance;
  windowSizeFactor: number;
  friendsListWidth: number;
  private viewPortTotalArea;
  unsupportedViewport: boolean;
  @Input() fileUploadAdapter: IFileUploadAdapter;
  windows: Window[];
  isBootstrapped: boolean;
  totalOnlineUsers = 0;
  //@Input() isDisabled: boolean;
  @Input() adapter: ChatAdapter;
    @Input() userId: any;
  @Input() isCollapsed: boolean;
  @Input() maximizeWindowOnNewMessage: boolean;
  @Input() pollFriendsList: boolean;
  @Input() pollingInterval: number;
  @Input() historyEnabled: boolean;
  @Input() emojisEnabled: boolean;
  @Input() linkfyEnabled: boolean;
  @Input() audioEnabled: boolean;
  @Input() searchEnabled: boolean;
  @Input() audioSource: string;
  @Input() persistWindowsState: boolean;
  @Input() title: string;
  @Input() messagePlaceholder: string;
  @Input() searchPlaceholder: string;
  @Input() browserNotificationsEnabled: boolean;
  @Input() browserNotificationIconSource: string;
  @Input() browserNotificationTitle: string;
  @Input() historyPageSize: number;
  @Input() localization: Localization;
  @Input() hideFriendsList: boolean;
  @Input() hideFriendsListOnUnsupportedViewport: boolean;
  @Input() fileUploadUrl: string;
  @Input() theme: Theme;
  @Input() customTheme: string;
  @Input() messageDatePipeFormat: string;
  @Input() showMessageDate: boolean;
  @Input() isViewportOnMobileEnabled: boolean;
  @Input() appUserId: any;
  @Output() onParticipantClicked: EventEmitter<IChatParticipant>;
  @Output() onChatClosed: EventEmitter<boolean>;
  @Output() onParticipantChatOpened: EventEmitter<IChatParticipant>;
  @Output() onParticipantChatClosed: EventEmitter<IChatParticipant>;
  @Output() onMessagesSeen: EventEmitter<Message[]>;
  @Output() onUnreadMessageNotify: EventEmitter<boolean>;

  @Input() OpenChatForByUserId: any;

  @ViewChildren('chatWindow') chatWindows: QueryList<XchatWindowComponent>;
  activeTab = 'people';
  //chatWindows: QueryList<NgChatWindowComponent>;
  //activeTab='friend-list'
  constructor(private authenticationService: AuthenticationService, private xEventScoketService: XEventSocketService, private _httpClient: HttpClient) {

    this._httpClient = _httpClient;
    // Exposes enums for the ng-template
    this.ChatParticipantType = ChatParticipantType;
    this.ChatParticipantStatus = ChatParticipantStatus;
    this.MessageType = MessageType;
    this._isDisabled = false;
    /*this.isCollapsed = false;*/
    this.maximizeWindowOnNewMessage = false;
    this.pollFriendsList = false;
    this.pollingInterval = 5000;
    this.historyEnabled = true;
    this.emojisEnabled = true;
    this.linkfyEnabled = true;
    this.audioEnabled = true;
    this.searchEnabled = true;
    this.audioSource = './assets/notification.wav';
    this.persistWindowsState = false;
    this.title = "Friends";
    this.messagePlaceholder = "Type a message";
    this.searchPlaceholder = "Search";
    this.browserNotificationsEnabled = true;
    this.browserNotificationIconSource = '';
    this.browserNotificationTitle = "New message from";
    this.historyPageSize = 10;
    this.hideFriendsList = false;
    this.hideFriendsListOnUnsupportedViewport = true;
    this.theme = Theme.Light;
    this.messageDatePipeFormat = "short";
    this.showMessageDate = true;
    this.isViewportOnMobileEnabled = false;
    this.onParticipantClicked = new EventEmitter();
    this.onParticipantChatOpened = new EventEmitter();
    this.onParticipantChatClosed = new EventEmitter();
    this.onChatClosed = new EventEmitter();
    this.onMessagesSeen = new EventEmitter();
    this.onUnreadMessageNotify = new EventEmitter();
    this.browserNotificationsBootstrapped = false;
    this.hasPagedHistory = false;
    
    // Don't want to add this as a setting to simplify usage. Previous placeholder and title settings available to be used, or use full Localization object.
    this.statusDescription = {
      online: 'Online',
      busy: 'Busy',
      away: 'Away',
      offline: 'Offline'
    };
    this.participantsInteractedWith = [];
    // Defines the size of each opened window to calculate how many windows can be opened on the viewport at the same time.
    this.windowSizeFactor = 320;
    // Total width size of the friends list section
    this.friendsListWidth = 262;
    // Set to true if there is no space to display at least one chat window and 'hideFriendsListOnUnsupportedViewport' is true
    this.unsupportedViewport = true;
    this.windows = [];
    this.isBootstrapped = false;
  }

  ngOnInit() {
    this.bootstrapChat();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.OpenChatForByUserId) {
      
      this.windows.forEach(x => {
        this.closeWindow(x);
      });
      if (this.participants) {
        console.log(this.OpenChatForByUserId);
        let tuser = this.participants.find(x => x.id == this.OpenChatForByUserId);
        if (tuser) {
          
          this.onParticipantClickedFromFriendsList(tuser);
        }
      }
    }
    
  }
  get isDisabled() {
    return this._isDisabled;
  }
  set isDisabled(value) {
    this._isDisabled = value;
    if (value) {
      window.clearInterval(this.pollingIntervalWindowInstance);
    }
    else {
      this.activateFriendListFetch();
      this.getConversionList();
    }
  }
  get localStorageKey() {
    return `x-chat-users-${this.userId}`; // Appending the user id so the state is unique per user in a computer.   
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.viewPortTotalArea = this.windowSizeFactor;//event.target.innerWidth;
    this.NormalizeWindows();
  }
  // Checks if there are more opened windows than the view port can display
  NormalizeWindows() {
    const maxSupportedOpenedWindows = 1;//Math.floor((this.viewPortTotalArea - (!this.hideFriendsList ? this.friendsListWidth : 0)) / this.windowSizeFactor);
    const difference = this.windows.length - maxSupportedOpenedWindows;
    if (difference >= 0) {
      this.windows.splice(this.windows.length - difference);
    }
    this.updateWindowsState(this.windows);
    // Viewport should have space for at least one chat window but should show in mobile if option is enabled.
    this.unsupportedViewport = true;//this.isViewportOnMobileEnabled ? false : this.hideFriendsListOnUnsupportedViewport && maxSupportedOpenedWindows < 1;
  }
  bootstrapChat() {
    let initializationException = null;
    if (this.adapter != null && this.userId != null) {
      try {
        //console.log("init chat bootstrap");
        this.viewPortTotalArea = this.windowSizeFactor;//window.innerWidth;
        this.initializeTheme();
        this.initializeDefaultText();
        this.initializeBrowserNotifications();
        // Binding event listeners
        this.adapter.messageReceivedHandler = (participant, msg) => this.onMessageReceived(participant, msg);
        this.adapter.friendsListChangedHandler = (participantsResponse) => this.onFriendsListChanged(participantsResponse);
        this.activateFriendListFetch();
        this.getConversionList();
        this.bufferAudioFile();
        this.hasPagedHistory = this.adapter instanceof PagedHistoryChatAdapter;
        if (this.fileUploadUrl && this.fileUploadUrl !== "") {
          //this.fileUploadAdapter = new DefaultFileUploadAdapter(this.fileUploadUrl, this._httpClient);
        }
        this.NormalizeWindows();
        this.isBootstrapped = true;
      }
      catch (ex) {
        console.log(ex);
        initializationException = ex;
      }
    }
    if (!this.isBootstrapped) {
      console.error("x-chat component couldn't be bootstrapped.");
      if (this.userId == null) {
        console.error("x-chat can't be initialized without an user id. Please make sure you've provided an userId as a parameter of the x-chat component.");
      }
      if (this.adapter == null) {
        console.error("x-chat can't be bootstrapped without a ChatAdapter. Please make sure you've provided a ChatAdapter implementation as a parameter of the x-chat component.");
      }
      if (initializationException) {
        console.error(`An exception has occurred while initializing x-chat. Details: ${initializationException.message}`);
        console.error(initializationException);
      }
    }
  }
  activateFriendListFetch() {
    if (this.adapter) {
      // Loading current users list
      if (this.pollFriendsList) {
        // Setting a long poll interval to update the friends list
        this.fetchFriendsList(true);
        this.pollingIntervalWindowInstance = window.setInterval(() => this.fetchFriendsList(false), this.pollingInterval);
      }
      else {
        // Since polling was disabled, a friends list update mechanism will have to be implemented in the ChatAdapter.
        this.fetchFriendsList(true);
      }
    }
  }
  // Initializes browser notifications
  //kanika
  initializeBrowserNotifications() {
    //return __awaiter(this, void 0, void 0, function* () {
    //  if (this.browserNotificationsEnabled && ("Notification" in window)) {
    //    if ((yield Notification.requestPermission()) === "granted") {
    //      this.browserNotificationsBootstrapped = true;
    //    }
    //  }
    //});
  }
  // Initializes default text
  initializeDefaultText() {
    if (!this.localization) {
      this.localization = {
        messagePlaceholder: this.messagePlaceholder,
        searchPlaceholder: this.searchPlaceholder,
        title: this.title,
        statusDescription: this.statusDescription,
        browserNotificationTitle: this.browserNotificationTitle,
        loadMessageHistoryPlaceholder: "Load older messages"
      };
    }
  }
  initializeTheme() {
    if (this.customTheme) {
      this.theme = Theme.Custom;
    }
    else if (this.theme != Theme.Light && this.theme != Theme.Dark) {
      // TODO: Use es2017 in future with Object.values(Theme).includes(this.theme) to do this check
      throw new Error(`Invalid theme configuration for x-chat. "${this.theme}" is not a valid theme value.`);
    }
  }
  // Sends a request to load the friends list
  fetchFriendsList(isBootstrapping) {
    this.adapter.listFriends()
      .pipe(map((participantsResponse) => {
        this.participantsResponse = participantsResponse;
        this.participants = participantsResponse.map((response) => {
          return response.participant;
        });
        
        //console.log(this.participants.length);
      })).subscribe(() => {
        if (isBootstrapping) {
          this.restoreWindowsState();
        }
      });
  }
  fetchMessageHistory(window) {
    // Not ideal but will keep this until we decide if we are shipping pagination with the default adapter
    if (this.adapter instanceof PagedHistoryChatAdapter) {
      window.isLoadingHistory = true;
      this.adapter.getMessageHistoryByPage(window.participant.id, this.historyPageSize, ++window.historyPage)
        .pipe(map((result) => {
          result.forEach((message) => this.assertMessageType(message));
          window.messages = result.concat(window.messages);
          window.isLoadingHistory = false;
          const direction = (window.historyPage == 1) ? ScrollDirection.Bottom : ScrollDirection.Top;
          window.hasMoreMessages = result.length == this.historyPageSize;
          setTimeout(() => this.onFetchMessageHistoryLoaded(result, window, direction, true));
        })).subscribe();
    }
    else {
      this.adapter.getMessageHistory(window.participant.socketUserId)
        .pipe(map((result) => {
          //console.log("getting for " + window.participant.socketUserId);
          result.forEach((message) => this.assertMessageType(message));
          window.messages = result.concat(window.messages);
          window.isLoadingHistory = false;
          setTimeout(() => this.onFetchMessageHistoryLoaded(result, window, ScrollDirection.Bottom));
        })).subscribe();
    }
  }
  onFetchMessageHistoryLoaded(messages, window, direction, forceMarkMessagesAsSeen = false) {
    this.scrollChatWindow(window, direction);
    if (window.hasFocus || forceMarkMessagesAsSeen) {
      const unseenMessages = messages.filter(m => !m.dateSeen);
      this.markMessagesAsRead(unseenMessages);
    }
  }
  // Updates the friends list via the event handler
  onFriendsListChanged(participantsResponse) {
    if (participantsResponse) {
      this.participantsResponse = participantsResponse;
      this.participants = participantsResponse.map((response) => {
        return response.participant;
      });
      //console.log("Fiel List changed");
      if (!this.conversationResponse || (this.conversationResponse && this.conversationResponse.length <= 0)) {
        this.getConversionList();
      }
      let temp = this.conversist;
      let tempupadte = [];
      if (temp) {
        temp.forEach(x => {
          let p = this.participants.find(y => y.id == x.id);
          if (p) {
            tempupadte.push(p);
          }
        });
      }
      this.conversist = tempupadte;
      this.participantsInteractedWith = [];
    }
  }
  // Handles received messages by the adapter
  onMessageReceived(participant, message) {
    console.log("Message Recievdd");
    if (participant && message) {
      this.updateParticipantConversationList(participant);
      this.UpdateConversationUnReadMessagCount(participant, 1);
      const chatWindow = this.openChatWindow(participant);
      this.assertMessageType(message);
      if (chatWindow) {
        if (!chatWindow.isNew || !this.historyEnabled) {
          chatWindow.window.messages.push(message);
          this.scrollChatWindow(chatWindow.window, ScrollDirection.Bottom);
          if (chatWindow.window.hasFocus) {
            this.markMessagesAsRead([message]);
            this.UpdateConversationUnReadMessagCount(participant, 0);
          } 
        }
      } 
      
      //if (chatWindow|| !this.historyEnabled) {
      //  chatWindow.messages.push(message);
      //  this.scrollChatWindow(chatWindow, ScrollDirection.Bottom);
      //  if (chatWindow.hasFocus) {
      //    this.markMessagesAsRead([message]);
      //  }
      //}
      //this.emitMessageSound(chatWindow);
      this.emitMessageSound(chatWindow.window);
      if (this.isCollapsed) {
        this.onUnreadMessageNotify.emit(true);
      }
      // Github issue #58 
      // Do not push browser notifications with message content for privacy purposes if the 'maximizeWindowOnNewMessage' setting is off and this is a new chat window.
      //if (this.maximizeWindowOnNewMessage || (!chatWindow.isNew && !chatWindow.window.isCollapsed)) {
      //  // Some messages are not pushed because they are loaded by fetching the history hence why we supply the message here
      //  this.emitBrowserNotification(chatWindow.window, message);
      //}
    }
  }
  onParticipantClickedFromFriendsList(participant) {
    //this.activeTab = 'window-mode';
    this.hideFriendsList = true;
    this.setActiveTab('conversation');
    let window = this.openChatWindow(participant, true, true);
    this.scrollChatWindow(window.window, ScrollDirection.Bottom);
    this.updateParticipantConversationList(participant);
    this.UpdateConversationUnReadMessagCount(participant, 0);
  }
  onParticipantBusinessCardSendClickedFromFriendsList(participant) {
    //this.activeTab = 'window-mode';
    this.hideFriendsList = true;
    this.setActiveTab('conversation');
    const chatWindow = this.openChatWindow(participant, true, true);
    if (chatWindow) {
      // if (!chatWindow.isNew || !this.historyEnabled) {
      this.sendBusinessCard(chatWindow, participant);
      this.updateParticipantConversationList(participant);
      this.UpdateConversationUnReadMessagCount(participant, 0);
      //}
    }
  }
  onParticipantBusinessCardRequestClickedFromFriendsList(participant) {
    //this.activeTab = 'window-mode';
    this.hideFriendsList = true;
    console.log("Request Card cliecked cliecked");
    this.setActiveTab('conversation');
    const chatWindow = this.openChatWindow(participant, true, true);
    if (chatWindow) {
      // if (!chatWindow.isNew || !this.historyEnabled) {
      this.requestBusinessCard(chatWindow, participant);
      this.updateParticipantConversationList(participant);
      this.UpdateConversationUnReadMessagCount(participant, 0);
      //}
    }
  }
  cancelOptionPrompt() {
    if (this.currentActiveOption) {
      this.currentActiveOption.isActive = false;
      this.currentActiveOption = null;
    }
  }
  onOptionPromptCanceled() {
    this.cancelOptionPrompt();
  }
  onOptionPromptConfirmed(event) {
    this.cancelOptionPrompt();
  }
  // Opens a new chat whindow. Takes care of available viewport
  // Works for opening a chat window for an user or for a group
  // Returns => [Window: Window object reference, boolean: Indicates if this window is a new chat window]
  openChatWindow(participant, focusOnNewWindow = false, invokedByUserClick = false) {
    // Is this window opened?
    const openedWindow = this.windows.find(x => x.participant.id == participant.id);
    if (!openedWindow) {
      if (invokedByUserClick) {
        this.onParticipantClicked.emit(participant);
      }
      // Refer to issue #58 on Github 
      const collapseWindow = invokedByUserClick ? false : !this.maximizeWindowOnNewMessage;
      const newChatWindow = new Window(participant, this.historyEnabled, collapseWindow);
      // Loads the chat history via an RxJs Observable
      if (this.historyEnabled) {
        this.fetchMessageHistory(newChatWindow);
      }
      if (this.windows.length < 1 || invokedByUserClick) {
        this.windows.unshift(newChatWindow);  
      }
      
      // Is there enough space left in the view port ? but should be displayed in mobile if option is enabled
      if (!this.isViewportOnMobileEnabled) {
        if (this.windows.length * this.windowSizeFactor >= this.viewPortTotalArea - (!this.hideFriendsList ? this.friendsListWidth : 0)) {
        if (this.windows.length > 1) {
          this.windows.pop();
          }
        }
      }
      //console.log(this.windows);
      this.updateWindowsState(this.windows);
      if (focusOnNewWindow && !collapseWindow) {
        this.focusOnWindow(newChatWindow);

      }
      if (!this.participantsInteractedWith.find(x => x.id == participant.id)){
         //this.participantsInteractedWith.push(participant);
      }

      this.onParticipantChatOpened.emit(participant);
      //console.log(newChatWindow);
      //return newChatWindow;
      //return [newChatWindow, true];
      return { window: newChatWindow,isNew: true};
    }
    else {
      // Returns the existing chat window
      //return openedWindow;
      return { window: openedWindow, isNew: false };
      //return [openedWindow, false];
    }
  }
  // Focus on the input element of the supplied window
  focusOnWindow(window, callback = () => { }) {
    //console.log(this.windows);
    const windowIndex = this.windows.indexOf(window);
    if (windowIndex >= 0) {
      setTimeout(() => {
        if (this.chatWindows) {
          //console.log(this.chatWindows);
          const chatWindowToFocus = this.chatWindows.toArray()[windowIndex];
          //Kanika
          //chatWindowToFocus.chatWindowInput.focus()
        }
        callback();
      });
    }
  }
  assertMessageType(message) {
    // Always fallback to "Text" messages to avoid rendenring issues
    if (!message.type) {
      message.type = MessageType.Text;
    }
  }
  // Marks all messages provided as read with the current time.
  markMessagesAsRead(messages) {
    const currentDate = new Date();
    messages.forEach((msg) => {
      msg.dateSeen = currentDate;
    });
    this.onMessagesSeen.emit(messages);
  }
  // Buffers audio file (For component's bootstrapping)
  bufferAudioFile() {
    if (this.audioSource && this.audioSource.length > 0) {
      this.audioFile = new Audio();
      this.audioFile.src = this.audioSource;
      this.audioFile.load();
    }
  }
  // Emits a message notification audio if enabled after every message received
  emitMessageSound(window) {
    if (this.audioEnabled && !window.hasFocus && this.audioFile) {
      this.audioFile.play();
    }
  }
  // Emits a browser notification
  emitBrowserNotification(window, message) {
    if (this.browserNotificationsBootstrapped && !window.hasFocus && message) {
      const notification = new Notification(`${this.localization.browserNotificationTitle} ${window.participant.displayName}`, {
        'body': message.message,
        'icon': this.browserNotificationIconSource
      });
      setTimeout(() => {
        notification.close();
      }, message.message.length <= 50 ? 5000 : 7000); // More time to read longer messages
    }
  }
  // Saves current windows state into local storage if persistence is enabled
  updateWindowsState(windows) {
    if (this.persistWindowsState) {
      const participantIds = windows.map((w) => {
        return w.participant.id;
      });
      localStorage.setItem(this.localStorageKey, JSON.stringify(participantIds));
    }
  }
  restoreWindowsState() {
    try {
      if (this.persistWindowsState) {
        const stringfiedParticipantIds = localStorage.getItem(this.localStorageKey);
        if (stringfiedParticipantIds && stringfiedParticipantIds.length > 0) {
          const participantIds = JSON.parse(stringfiedParticipantIds);
          const participantsToRestore = this.participants.filter(u => participantIds.indexOf(u.id) >= 0);
          participantsToRestore.forEach((participant) => {
            this.openChatWindow(participant);
          });
        }
      }
    }
    catch (ex) {
      console.error(`An error occurred while restoring x-chat windows state. Details: ${ex}`);
    }
  }
  // Gets closest open window if any. Most recent opened has priority (Right)
  getClosestWindow(window) {
    const index = this.windows.indexOf(window);
    if (index > 0) {
      return this.windows[index - 1];
    }
    else if (index == 0 && this.windows.length > 1) {
      return this.windows[index + 1];
    }
  }
  closeWindow(window) {
    const index = this.windows.indexOf(window);
    this.windows.splice(index, 1);
    this.updateWindowsState(this.windows);
    this.onParticipantChatClosed.emit(window.participant);
    //this.activeTab = 'friend-list';
    this.hideFriendsList = false;
    //this.setActiveTab('people');
  }
  getChatWindowComponentInstance(targetWindow) {
    const windowIndex = this.windows.indexOf(targetWindow);
    if (this.chatWindows) {
      let targetWindow = this.chatWindows.toArray()[windowIndex];
      return targetWindow;
    }
    return null;
  }
  // Scrolls a chat window message flow to the bottom
  scrollChatWindow(window, direction) {
    const chatWindow = this.getChatWindowComponentInstance(window);
    if (chatWindow) {
      chatWindow.scrollChatWindow(window, direction);
    }
  }
  onWindowMessagesSeen(messagesSeen) {
    this.markMessagesAsRead(messagesSeen);
  }
  onWindowChatClosed(payload) {
    const { closedWindow, closedViaEscapeKey } = payload;
    if (closedViaEscapeKey) {
      let closestWindow = this.getClosestWindow(closedWindow);
      if (closestWindow) {
        this.focusOnWindow(closestWindow, () => { this.closeWindow(closedWindow); });
      }
      else {
        this.closeWindow(closedWindow);
      }
    }
    else {
      this.closeWindow(closedWindow);
    }
    //this.getConversionList();
  }
  onWindowTabTriggered(payload) {
    const { triggeringWindow, shiftKeyPressed } = payload;
    const currentWindowIndex = this.windows.indexOf(triggeringWindow);
    let windowToFocus = this.windows[currentWindowIndex + (shiftKeyPressed ? 1 : -1)]; // Goes back on shift + tab
    if (!windowToFocus) {
      // Edge windows, go to start or end
      windowToFocus = this.windows[currentWindowIndex > 0 ? 0 : this.chatWindows.length - 1];
    }
    this.focusOnWindow(windowToFocus);
  }
  onWindowMessageSent(messageSent) {
    //console.log(messageSent);
    this.adapter.sendMessage(messageSent);
  }
  onWindowOptionTriggered(option) {
    this.currentActiveOption = option;
  }
  triggerOpenChatWindow(user) {
    if (user) {
      this.openChatWindow(user,true,true);
    }
  }
  triggerCloseChatWindow(userId) {
    console.log(userId);
    const openedWindow = this.windows.find(x => x.participant.id == userId);
    if (openedWindow) {
      this.closeWindow(openedWindow);
    }
  }
  triggerToggleChatWindowVisibility(userId) {
    const openedWindow = this.windows.find(x => x.participant.id == userId);
    if (openedWindow) {
      const chatWindow = this.getChatWindowComponentInstance(openedWindow);
      if (chatWindow) {
        chatWindow.onChatWindowClicked(openedWindow);
      }
    }
  }

  getOnlineUserCount(participants) {
    if (participants) {
      return participants.filter(x => x.status == ChatParticipantStatus.Online).length + 1;
    } else {
      return 0;
    }
  }
  setActiveTab(tab) {
    this.activeTab = tab;
    this.windows.forEach(win => {
      this.closeWindow(win);
    });
    if (tab == 'people') {
      this.hideFriendsList = false;
    } else {
      //this.getConversionList();
    }
  }
  getConversionList() {
    this.adapter.getConversations()
      .pipe(map((conversationResponse) => {
        this.conversationResponse = conversationResponse;
        this.conversist = conversationResponse.map((response) => {
          let pp = response.participant;
          if (response && response.participant) {
            pp.hasUnreadMessage = response.metadata && response.metadata.totalUnreadMessages && response.metadata.totalUnreadMessages > 0 ? 1 : 0; 
          }
          return pp;
        });
        this.conversist.sort((x, y) => (y.hasUnreadMessage - x.hasUnreadMessage));
        if (this.conversist.find(x => x.hasUnreadMessage == 1))
        {
          this.onUnreadMessageNotify.emit(true);
        }
      })).subscribe(() => {
      });
  }
  toggleChat() {
    this.isCollapsed = true;
    this.onChatClosed.emit(true);
  }
  requestBusinessCard(window, participant) {
    let message = new Message();
    message.fromId = this.userId;
    message.toId = participant.id;
    message.message = "Request for business card sent";
    message.dateSent = new Date();
    message.type = MessageType.BCardRequested.valueOf();
    console.log(window.isNew);
    if (!window.isNew) {
      window.window.messages.push(message);
    }
    this.onWindowMessageSent(message);
    this.scrollChatWindow(window.window, ScrollDirection.Bottom);
    this.markMessagesAsRead([message]);
  }
  sendBusinessCard(window, participant) {
    let message = new Message();
    message.fromId = this.userId;
    message.toId = participant.id;
    message.message = "Business card sent successfully";
    message.dateSent = new Date();
    message.type = MessageType.BCardSent.valueOf();
    console.log(window.isNew);
    if (!window.isNew) {
      window.window.messages.push(message);
    }
    this.scrollChatWindow(window.window, ScrollDirection.Bottom);
    this.onWindowMessageSent(message);
    this.markMessagesAsRead([message]);
  }

  updateParticipantConversationList(participant) {
    let conversationResRef;
    let conversationRef;
     if (this.conversationResponse) {
        conversationResRef = this.conversationResponse.find(x => x.participant.id == participant.id);
        conversationRef = this.conversist.find(x => x.id == participant.id);
    }
    if (this.conversationResponse && !conversationRef) {
      this.conversist.unshift(participant);
      let ncr = new ParticipantResponse();
      ncr.participant = participant;
      if (ncr.metadata) {
        ncr.metadata.totalUnreadMessages = 1;
      } else {
        ncr.metadata = { totalUnreadMessages: 1 };
        //ncr.metadata.totalUnreadMessages = 1;
      }
      this.conversationResponse.splice(0, 0, ncr);
      //this.conversationResponse.push(ncr);
    }
    else {
      let reorder = this.conversist.filter(x => x.id != participant.id)
      reorder.unshift(participant);
      this.conversist = reorder;
    }
  }

  UpdateConversationUnReadMessagCount(participant, unreadMessages) {
    //console.log("setting count to " + unreadMessages);
    let conversationResRef;
    let conversationRef;
    if (this.conversationResponse) {
      conversationResRef = this.conversationResponse.find(x => x.participant.id == participant.id);
      conversationRef = this.conversist.find(x => x.id == participant.id);
    }
    if (this.conversationResponse && conversationRef) {
      let ind = this.conversationResponse.indexOf(conversationResRef);
      if (conversationResRef.metadata) {
        conversationResRef.metadata.totalUnreadMessages = unreadMessages;
      }else
      {
        conversationResRef.metadata = { totalUnreadMessages: unreadMessages };
      }
      if (unreadMessages > 0) {
        this.conversationResponse.splice(ind, 1);
        this.conversationResponse.splice(0, 0, conversationResRef);
      }else {
        this.conversationResponse.splice(ind, 1, conversationResRef);
        //this.conversationResponse.push(conversationResRef);
      }
    }
  }

}
