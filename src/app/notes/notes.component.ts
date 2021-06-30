import { Component, OnInit, NgZone, Input, EventEmitter, Output } from '@angular/core';
import { User, Webcast } from '../_models';
import { Router } from '@angular/router';
import { WebcastService } from '../_services';
import { Room, MainEvent } from '../_models/room.model';
import { FormControl, Validators } from '@angular/forms';
import { RoomService } from '../_services/room.service';
import { NotesService } from '../_services/notes.service';
import { Notes } from '../_models/notes';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
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
    private zone: NgZone, private noteService: NotesService) {
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
    this.roomService.submitComment(this.webcast.webcast_id, this.activeRoomId, this.txtquestion.value).subscribe(data => {
      if (data.error) {
        this.showError(data.error.message);
      } else {
        let n = new Notes();
        n.comment = this.txtquestion.value;
        n.webcastId = this.webcast.webcast_id;
        n.tag = this.activeRoomId.toString();
        n.description = this.txtquestion.value;
        n.id= data?.comment?.id;
        this.noteService.addNote(n);
        let msg = data?.success;
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
    this.error = "";
    this.loading = false;
    this.submitted = false;
    this.txtquestion.setValue("");
  }
  closePopup() {
    this.close.emit();
  }
  
  
 
}
