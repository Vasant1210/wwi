import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChatParticipantStatus } from '../core/chat-participant-status';
import { chatParticipantStatusDescriptor } from '../core/chat-participant-status-descriptor';
import { MessageCounter } from '../core/message-counter';
import { SanitizeHtmlPipe } from '../../sanitizing';
import {BusinessCardService} from '../../_services/business-card.service';
import { Observable} from 'rxjs';
import { WebcastService } from '../../_services';
import { Webcast } from '../../_models';
@Component({
  selector: 'app-xchat-friends-list',
  templateUrl: './xchat-friends-list.component.html',
  styleUrls: ['./xchat-friends-list.component.css']
})
export class XchatFriendsListComponent implements OnInit {

  @Output() onParticipantClicked = new EventEmitter<any>();
  @Output() onParticipantBusinessCardSendClicked = new EventEmitter<any>();
  @Output() onParticipantBusinessCardRequestClicked = new EventEmitter<any>();
  @Output() onOptionPromptCanceled = new EventEmitter<any>();
  @Output() onOptionPromptConfirmed = new EventEmitter<any>();

  @Input() participants;
  @Input() participantsResponse;
  @Input() participantsInteractedWith = []
  @Input() windows
  @Input() userId
  @Input() localization
  @Input() shouldDisplay
  @Input() isCollapsed: boolean
  @Input() showBusinessCard: boolean = true;
  @Input() showUnreadMessageAlert: boolean = false;
  @Input() searchEnabled
  @Input() currentActiveOption: any

  webcast: Webcast;
  cardFlag: Observable<any>;
  canSend:boolean=true;
  canRequest:boolean=true;

  selectedUsersFromFriendsList = [];
  searchInput = '';
  businessCardActionInit = false;
  selectedUser;
  loading = false;
  // Exposes enums and functions for the ng-template
  get ChatParticipantStatus() {
    return ChatParticipantStatus;
  }
  get chatParticipantStatusDescriptor() {
    return chatParticipantStatusDescriptor;
  }
  

  constructor(private businessCardService:BusinessCardService,private webcastService: WebcastService) {
    
  }

  ngOnInit(): void {
    this.webcastService.webcast.subscribe(x => {
      if (x) {
        this.webcast = x; 
      }
    })
  }
  ngOnChanges(): void {
    if (this.currentActiveOption) {
      var currentOptionTriggeredBy_1 = this.currentActiveOption && this.currentActiveOption.chattingTo.participant.id;
      var isActivatedUserInSelectedList = (this.selectedUsersFromFriendsList.filter(function (item) { return item.id == currentOptionTriggeredBy_1; })).length > 0;
      if (!isActivatedUserInSelectedList) {
        this.selectedUsersFromFriendsList = this.selectedUsersFromFriendsList.concat(this.currentActiveOption.chattingTo.participant);
      }
    }
  }
  get filteredParticipants() {
    if (this.searchInput.length > 0) {
      var str = this.searchInput.toUpperCase();
      // Searches in the friend list by the inputted search string
      return this.participants.filter(function (x) { return x.displayName.toUpperCase().includes(str); });
    }
    return this.participants;
  } 
  isUserSelectedFromFriendsList(user) {
    return (this.selectedUsersFromFriendsList.filter(function (item) { return item.id == user.id; })).length > 0;
  };
  unreadMessagesTotalByParticipant(participant) {
        var openedWindow = this.windows.find(function (x) { return x.participant.id == participant.id; });
    //console.log(this.windows);
    //return MessageCounter.unreadMessagesTotal(openedWindow, this.userId);
    if (openedWindow) {
      return MessageCounter.unreadMessagesTotal(openedWindow, this.userId);
    }
    else {
      //console.log(participant);
      let x = this.participantsResponse.find(x => x.participant.id == participant.id);
      //console.log(x);
      if (x && x.metadata) {
        return x.metadata.totalUnreadMessages;
      } else {
        return 0;
      }

      /*var totalUnreadMessages = this.participantsResponse
        .filter(function (x) { return x.participant.id == participant.id && !this.participantsInteractedWith.find(function (u) { return u.id == participant.id; }) && x.metadata && x.metadata.totalUnreadMessages > 0; },this)
        .map(function (participantResponse) {
          return participantResponse.metadata.totalUnreadMessages;
        })[0];
      return MessageCounter.formatUnreadMessagesTotal(totalUnreadMessages);*/
    }
  };
  onChatTitleClicked() {
    this.isCollapsed = !this.isCollapsed;
  }
  onFriendsListCheckboxChange(selectedUser, isChecked) {
    if (isChecked) {
      this.selectedUsersFromFriendsList.push(selectedUser);
    }
    else {
      this.selectedUsersFromFriendsList.splice(this.selectedUsersFromFriendsList.indexOf(selectedUser), 1);
    }
  };
  onUserClick(clickedUser) {
    this.onParticipantClicked.emit(clickedUser);
  };
  onFriendsListActionCancelClicked() {
    this.onOptionPromptCanceled.emit();
    this.cleanUpUserSelection();
  }

  onFriendsListActionConfirmClicked() {
    this.onOptionPromptConfirmed.emit(this.selectedUsersFromFriendsList);
    this.cleanUpUserSelection();
  }
  cleanUpUserSelection() {
    this.selectedUsersFromFriendsList = [];
  };
  openBusinessCardActionTab(clickedUser) {
    this.loading = true;
    this.businessCardService.getCardFlags(this.webcast.webcast_id,clickedUser.id).subscribe
    (x => 
    {
        this.loading = false;
        this.cardFlag = x; 
        this.canRequest=x.can_request;
        this.canSend=x.can_send;      
    }); 
    
    this.selectedUser = clickedUser;
    this.businessCardActionInit = true;
  }
  sendBusinessCard() {
    if(this.canSend)
    {
      this.onParticipantBusinessCardSendClicked.emit(this.selectedUser);
      this.businessCardActionInit = false;
    }    
  }
  requestBusinessCard() {
    if(this.canRequest)
    {
      this.onParticipantBusinessCardRequestClicked.emit(this.selectedUser);
      this.businessCardActionInit = false;
    }    
  }
  cancelBusinessCardAction() {
    this.businessCardActionInit = false;
  }
  /*this.cleanUpUserSelection = function () { return _this.selectedUsersFromFriendsList = []; };*/
}
