import { Component, OnInit, Input, EventEmitter, SimpleChanges, Output } from '@angular/core';

@Component({
  selector: 'app-message-popup',
  templateUrl: './message-popup.component.html',
  styleUrls: ['./message-popup.component.css']
})
export class MessagePopupComponent implements OnInit {
  @Input() message: string;
  @Output() onclosePopup = new EventEmitter<any>();
  showPop = false;
  constructor() { }

  ngOnInit(): void {
    console.log(this.message);
    if (this.message != '') {
      this.showPop = true;
    } else {
      this.showPop = false;
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(this.message);
    if (this.message != '') {
      this.showPop = true;
    } else {
      this.showPop = false;
    }
  }
  closePopup() {
    this.showPop = false;
    this.onclosePopup.emit();
  }
  openPopup() {
    this.showPop = true;
  }
}
