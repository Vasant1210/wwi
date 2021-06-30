import { Component, OnInit, EventEmitter, Output , Input,  ViewChild  } from '@angular/core';
import { NotesService } from '../_services/notes.service';
import { QuestionService } from '../_services/question.service';
import { WebcastService, AuthenticationService } from '../_services';
import { Webcast, User } from '../_models';
import { Emedia } from 'src/app/_models/emedia';
import { Notes } from '../_models/notes';
import { ViewerBussinessCard } from '../_models/viewer-bussiness-card';
import { Question } from '../_models/question';
import { GalleryService } from '../_services/gallery.service';
import { RoomService } from '../_services/room.service';
import { viewerMedia } from '../_models/viewer-media';
import { DomSanitizer } from '@angular/platform-browser';
import { jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';
import { StatsService } from '../_services/stats.service';
import { Stats } from '../_models/user-stats.model';
import { GoogleAnalyticsService, NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';

@Component({
  selector: 'app-briefcase',
  templateUrl: './briefcase.component.html',
  styleUrls: ['./briefcase.component.css']
})
export class BriefcaseComponent implements OnInit {
  @ViewChild('modalCloseButton') modalCloseButton;
  @Output() onClose = new EventEmitter<any>();
  webcast: Webcast;
  notes: Notes[];
  questions: Question[];
  viewer_media: viewerMedia[];
  viewer_mmedia: Emedia[];
  viewer_vmedia: Emedia[];
  viewer_document:viewerMedia[]=[];
  fileContent: string;
  business_card:ViewerBussinessCard[]=[];
  str: string;
  blob;
  noteText;
  el;
  success:string ="";
  error = "";
  noteDetails: Notes;
  questionDetails: Question;
  currentUser: User;

  constructor(private notesService: NotesService, private roomService: RoomService, private webcastService: WebcastService, private _sanitizer: DomSanitizer, private questionService: QuestionService, private galleryService: GalleryService, private statsService: StatsService,private authService: AuthenticationService, private $gaService: GoogleAnalyticsService) {
  }
  
  ngOnInit(): void {
    this.resetMessage();
    this.webcastService.webcast.subscribe(x => {
      if (x) {
        this.webcast = x;
        if (this.authService.currentUserValue)
        {
          this.$gaService.pageView(`/${this.webcast.webcast_id}/briefcase`, `/${this.webcast.webcast_id}/briefcase`, undefined, {
            user_id: this.authService.currentUserValue.id            
          })       
        }else{
          this.$gaService.pageView(`/${this.webcast.webcast_id}/briefcase`, `/${this.webcast.webcast_id}/briefcase`)        
        }
      
       
        this.loadNotes();
        this.loadQuestion();
        
        this.loadBussinessCard();
      }
    })
    this.loadViewerMedia();
    this.notesService.notes.subscribe(x => {
      this.notes = x
    });
    this.questionService.question.subscribe(x => {
      this.questions = x
    });
    /*this.galleryService.viewerMedia.subscribe(x => {
      this.viewer_media = x
    });*/
  }
  loadNotes() {
    this.notesService.loadNotes(this.webcast.webcast_id).subscribe(
      x => { this.notes = x });
  }
  loadQuestion() {
    this.questionService.loadQuestion(this.webcast.webcast_id).subscribe(
      x => { this.questions = x }
    );     
  }

  loadBussinessCard() {
    this.roomService.loadBussinessCard(this.webcast.webcast_id).subscribe(
      x => { this.business_card = x 
        console.log(this.business_card);      
      }
    );     
  }

  

  loadViewerMedia() {
    this.galleryService.loadViewerMedia(this.webcast.webcast_id).subscribe(
      x => {       
        if (x) {
          this.viewer_media = x;
          this.viewer_mmedia = x.filter(y => y.media_type == 'image').map(x => { return x.media });
          this.viewer_vmedia = x.filter(y => y.media_type == 'video').map(x => { return x.media });
          this.viewer_document = x.filter(y => y.media_type == 'document');       
        }
      }
    );     
  }

  closeModal() {
    this.modalCloseButton.nativeElement.click();
    this.onClose.emit();
  }

  deleteNote(note:Notes){   
    this.resetMessage();
    if(note)
    {
      if(confirm("Are you sure to delete?")) {      
         
          this.notesService.deleteNote(this.webcast.webcast_id,note.id).subscribe(
            data=>{
                if(data && data.success)
                {
                  this.success = data.success;
                  this.noteDetails = null;
                }
            },
            error=>{
                this.error =  error;
            }
          )
      }
    }
    return"";
  }

  deleteViewerMedia(event: Emedia) {
    this.resetMessage();
      if (event)
      {      
        if(confirm("Are you sure to delete?")) {  
          var f = this.viewer_media.find(x => x.media_id == event.id);
          this.galleryService.deleteViewerMedia(this.webcast.webcast_id,f.id).subscribe(
            data=>{
              if (data && data.success) {
                this.success = data.success;
                this.viewer_media = this.viewer_media.filter(x => x.id != f.id);
                switch (f.media_type) {
                  case "image":
                    this.viewer_mmedia = this.viewer_media.filter(y => y.media_type == 'image').map(x => { return x.media });
                    break
                  case "video":
                    this.viewer_vmedia = this.viewer_media.filter(y => y.media_type == 'video').map(x => { return x.media });
                    break;
                  case "document":
                    this.viewer_document = this.viewer_media.filter(y => y.media_type == 'document');
                    break;
              }

                }
            },
            error=>{
                this.error =  error;
            }
          )
        }
      return"";
    }

  }

  hasWidget(name) {
    
    return this.webcastService.hasWidget(name);
  }

  getNoteHref(note:Notes)
  {   
     
    if(note){   
     return this._sanitizer.bypassSecurityTrustUrl('data:text/plain;charset=utf-8,' + encodeURIComponent(note.description));
    }
    return  "";
  }

  updateStatBriefcase()
  {
    this.statsService.trackActivity(this.webcast.webcast_id,'download_item_briefcase');  
  }

  getQuestionHref(question:Question)
  {    
    if(question){     
      let queAns='Question- '+question.description+'   Answer- '+question.answer;
      return this._sanitizer.bypassSecurityTrustUrl('data:text/plain;charset=utf-8,' + encodeURIComponent(queAns));
    }
    return  "";
  }

  resetMessage()
  {
    this.error="";
    this.success="";
  }

  showNoteDetails(note: Notes) {
    this.noteDetails = note;
  }

  showQuestionDetails(question: Question) {
    this.questionDetails = question;
  }

  truncateString(str:string, n:number){
    return (str.length > n) ? str.substr(0, n-1) + '…' : str;
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

  downloadBusinesscard(type:string,name:string,id:number) {
    this.statsService.trackActivity(this.webcast.webcast_id,'download_item_briefcase'); 
    var data = document.getElementById('businesscardId-' + type+'-'+id);
    html2canvas(data).then(canvas => {
      var imgWidth = 208;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'px');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const marginX = (pageWidth - imgWidth) / 2;
      const marginY = (pageHeight - imgHeight) / 2;

      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', marginX, marginY, imgWidth, imgHeight)
      pdf.save(name + 'businesscard.pdf');
    });
  }

  openDocumnet(filename:string)
  {
    //console.log(filename);
    window.open(filename, '_blank');
  }

  
}
  

  

