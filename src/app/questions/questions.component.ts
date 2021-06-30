import { Component, OnInit, NgZone, Input, EventEmitter, Output  } from '@angular/core';
import { User, Webcast } from '../_models';
import { Router } from '@angular/router';
import { WebcastService } from '../_services';
import { Room, MainEvent } from '../_models/room.model';
import { FormControl, Validators } from '@angular/forms';
import { RoomService } from '../_services/room.service';
import { StatsService } from '../_services/stats.service';
import { Stats } from '../_models/user-stats.model';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  @Output() close = new EventEmitter<any>();
  @Input() activeRoomId: number;
  loading = false;
  submitted = false;
  currentUser: User;
  webcast: Webcast;
  error = "";
  success = "";
  txtquestion = new FormControl('', [Validators.required]);
  constructor(private webcastService: WebcastService, private roomService: RoomService,
    private zone: NgZone, private statsService: StatsService) {
    this.webcastService.webcast.subscribe(x => this.webcast = x);
  }
  ngOnInit() {
    this.success = "";
    this.error = "";
  }
   /**
   * Questions submission
   */
  addRemark() {
    this.setLoading();
    if (!this.txtquestion.valid) {
      this.unsetLoading();
      return;
    }
    this.roomService.submitQuestion(this.webcast.webcast_id, this.activeRoomId, this.txtquestion.value).subscribe(data => {
      if (data.error) {
        this.showError(data.error.message);
      } else {
        let msg = data?.success;
        this.statsService.trackActivity(this.webcast.webcast_id,'ask_question');  
        this.resetLoading(msg);
      }
    },
      error => {
        this.showError(error);
      });
  }
  
  public checkError(errorName: string) {
    return this.txtquestion.hasError(errorName);
  }
  showError(message) {
    this.error = message;
    this.loading = false;
    this.submitted = false;
  }
  setLoading() {
    this.error = "";
    this.loading = true;
    this.submitted = true;
  }
  unsetLoading() {
    this.loading = false;
  }
  resetLoading(message) {
    this.success = message;
    this.loading = false;
    this.submitted = false;
    this.txtquestion.setValue("");
  }

  closePopup() {
    this.close.emit();
  }
}
