import { Component, OnInit, NgZone, Input, EventEmitter, Output } from '@angular/core';
import { Pollselect, User, Webcast } from '../_models';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService, WebcastService, PollService } from '../_services';
import { ActivePoll } from '../_models/active-poll';
import { StatsService } from '../_services/stats.service';
import { Stats } from '../_models/user-stats.model';

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.css']
})
export class PollsComponent implements OnInit {
  @Output() close = new EventEmitter<any>();
  @Input() activeRoomId: number;
  @Output() activePoleDetcted = new EventEmitter<boolean>();
  webcast: Webcast;
  message: string = "";
  activePoll: ActivePoll = null;
  selectedOption: { qid: string; oid: string; };
  active_poll_selection: any[]=[];
  requiredAnswerError = false;
  error_message = "";
  hasAttended = false;
  hasDeclared = false;
  shouldParticipate = true;
  strorage_key = "";
  currentUser: User;
  sucessMessage = "";
  constructor(private webcastService: WebcastService, private pollService: PollService, private authService: AuthenticationService, private statsService: StatsService) {

  }
  ngOnInit() {
    this.authService.currentUser.subscribe(x => { this.currentUser = x; })
    this.webcastService.webcast.subscribe(x => {
      this.webcast = x;
      if (x && this.activeRoomId) {
        this.strorage_key = this.webcast.webcast_id + "_polls";
        //this.pollService.loadPollFromDB(this.webcast.webcast_id, this.activeRoomId);
        this.getActivepoll();
      }
    });
    this.sucessMessage = "";
  }

  
  getActivepoll() {
    this.pollService.activePoll.subscribe(p => {
      if (p) {
        console.log(p);
        console.log(this.activeRoomId);
        this.activePoll = p.find(f => f.roomId == this.activeRoomId);
        console.log(this.activePoll);
        if (this.activePoll) {
          console.log("I detected the chnage and fired emit");
          this.activePoleDetcted.emit(true);
          
          if (this.activePoll.poll.status == 3) {
            this.hasDeclared = true;
            this.shouldParticipate = false;
            this.requiredAnswerError = false;
            this.hasAttended = false;
          } else {
            if (this.getStoredPoll()) {
              this.hasAttended = true;
              this.shouldParticipate = false;
              this.requiredAnswerError = false;
              this.hasDeclared = false;
            } else {
              this.hasDeclared = false;
              this.hasAttended = false;
              this.requiredAnswerError = false;
              this.shouldParticipate = true;
              console.log("I am here");
            }
          }
        }
      }
    });
  }

  submitPoll(event_active_poll_id) {
    if (this.active_poll_selection.length != this.activePoll.poll.question.length) {
      this.requiredAnswerError = true;
      return;
    } else {
      if (this.activePoll.pollId == event_active_poll_id) {
        this.pollService.submitPoll(this.webcast.webcast_id, event_active_poll_id, this.active_poll_selection, this.activeRoomId).subscribe(
          result => {
            this.hasAttended = true;
            this.shouldParticipate = false;
            localStorage.setItem(this.strorage_key, JSON.stringify({ [this.activeRoomId + '_' + this.currentUser.id + '_' + event_active_poll_id]: this.active_poll_selection }));
            this.sucessMessage = result.success ? 'Thanks, your vote has been submitted' : '';
            this.statsService.trackActivity(this.webcast.webcast_id,'answer_poll');  
          });
      } 
    }
  }
  onPollQuestionOptionSelect(value) {
    let arr = value.split("_");
    this.active_poll_selection = this.active_poll_selection.filter(h => h.qid !== arr[0]);
    this.active_poll_selection.push({ "qid": arr[0], "oid": arr[1] });
  }
  isMyAnswer(qid, oid) {
    var obj = this.active_poll_selection.find(x => x.qid == qid && x.oid == oid);
    if (obj) {
      return "selected text-white";
    }
    return "";
  }

  getStoredPoll() {
    let pollsAttended = null;
    var storagePollsAttended = JSON.parse(localStorage.getItem(this.strorage_key));
    if (storagePollsAttended) {
      pollsAttended = storagePollsAttended[this.activeRoomId + '_' + this.currentUser.id +"_" + this.activePoll.pollId];
      console.log(pollsAttended);
      if (pollsAttended) {
        this.active_poll_selection = pollsAttended;
      }
    }
    return pollsAttended;
  }

  closePopup() {
    this.close.emit();
  }
}
