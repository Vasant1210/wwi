import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-shared-viewer-card',
  templateUrl: './shared-viewer-card.component.html',
  styleUrls: ['./shared-viewer-card.component.css']
})
export class SharedViewerCardComponent implements OnInit, OnChanges{

  constructor() { }
  @Input() profile: any; 
  ngOnInit(): void {
    console.log(this.profile);
  }

  ngOnChanges(simpleChange: SimpleChanges)
  {

  }
  renderDefaultProfilePic(url, name) {
    if (url && url != "") {
      return url;
    } else {
      let canvas: HTMLCanvasElement = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      let ctx: any = canvas.getContext("2d");
      ctx.fillStyle = "#004c3f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "60px Config";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      if (name) {
        ctx.fillText(name.substr(0, 1), 50, 70);
      }
      else {
        ctx.fillText("T", 50, 70);
      }
      //ctx.fillText(currentUser.fullName.substr(0,1), 10, 50);
      return canvas.toDataURL("image/png");
    }
  }
}
