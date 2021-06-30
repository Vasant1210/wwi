import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef, Input } from '@angular/core';
import { CustomFormService } from '../_services/custom-form.service';
import { WebcastService, CformService, AuthenticationService } from '../_services';
import { Cform, Webcast, User } from '../_models';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute, Params } from '@angular/router';
import { ThemeService } from '../_services/theme.service';
import { Theme } from '../_models/theme.model';
import { CustomForm } from '../_models/custom-form';
import { filter } from 'rxjs/operators';
/*import { CometChatService } from '../_services/comet-chat.service';*/
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DeviceDetectorService } from 'ngx-device-detector';
import { StatsService } from '../_services/stats.service';
import { Stats } from '../_models/user-stats.model';
import { XEventSocketService } from '../_services/x-event-socket.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Output() public close = new EventEmitter();
  @Input('mode') public mode = "new";
  @ViewChild('profilepic', { static: false }) eleprofilepic: ElementRef;
  cform: CustomForm;
  webcast: Webcast;
  currentUser: User;
  theme: Theme;
  profileForm: FormGroup;
  submitted = false;
  loading = false;
  error = "";
  success = "";
  imageSrc = "";
  others: string[] = [];
  showValidationSummary = true;
  isMobile: boolean;
  constructor(
    private webcastService: WebcastService,
    private authenticationService: AuthenticationService,
    private customFormService: CustomFormService,
    private activatedRoute: ActivatedRoute,
   
    /*private cometChat: CometChatService,*/
    private deviceService: DeviceDetectorService,
    private statsService: StatsService
   
  ) {
    
    this.webcastService.webcast.subscribe(x => {
      if (x) {
        this.webcast = x;
        this.theme = x.theme;
        
        
      }
    });
    /*this.activatedRoute.params.subscribe(x => {
      if (x && x.mode) {
        this.mode = x.mode;
      }

    });*/
    /*this.cometChat.hideWidget();*/
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe(x =>{
      if(x){
        this.currentUser = x;
        this.customFormService.getProfile(this.currentUser.webcast_id).subscribe(y => {
          if (y) {
            this.cform = y;
            this.renderFields();
          }
        });
      }
    });
    
  }
  onSubmit() {
    
    this.setLoading();
    if (this.profileForm.invalid) {
      this.unsetLoading();
      return;
    }
    let fieldsWithValue = {};
    let hasEmptyValue = false;
    for (const field in this.profileForm.controls) {
      const control = this.profileForm.get(field);
      let dbField = this.customFormService.getFieldLabel(this.cform, field);
      if (dbField != "") {
        if(control.value == "")
        {
          hasEmptyValue = true;
        }
        fieldsWithValue[dbField] = control.value;
      }
    }
    const controlFile = this.profileForm.get('profile_pic');
    if (controlFile) {
      fieldsWithValue['profile_pic'] = controlFile.value
    } else
    {
      hasEmptyValue = true;
    }
   

    this.customFormService.saveProfile(this.webcast.webcast_id, JSON.stringify(fieldsWithValue),null, null)
      .subscribe(
        data => {
          if (data && (data.error || data.success)) {
			 
            if (data.error) {
              this.showError(data.error.message);
            } else {
				     this.success="We’ll be live soon! Stay tuned."; 

				    setTimeout(()=>{  if (data.profile) {
                this.authenticationService.updateProfile(data.profile);
              }
             
           
              this.handleSuccess(!hasEmptyValue); }, 4000)
             
              
            }
          } else {
            if (data.profile) {
              this.authenticationService.updateProfile(data.profile);
            }
            //call acvity srevice
           
           // this.statsService.trackActivity(this.webcast.webcast_id,'profile_complete');
            this.handleSuccess(!hasEmptyValue);

          }
        },
        error => {
          this.showError(error);
        }
      );
  }
  public checkError = (controlName: string, errorName: string) => {
    if (this.profileForm.controls[controlName]) {
      return this.profileForm.controls[controlName].hasError(errorName);
    }
    return true;
  }
  renderFields() {
    let group: any = {};
    this.cform.fields.forEach(field => {
      let validatorsArr = [];
      if (field.required == "true") {
        validatorsArr.push(Validators.required);
      } else if (field.type == "email") {
        validatorsArr.push(Validators.email);
      }
      if (field.label == "Age") {
        validatorsArr.push(Validators.max(150));
      }
      if (field.type == "file") {
        this.imageSrc = field.value;
      }

      let fc = new FormControl(field.value, validatorsArr);
      if (field.disabled) {
        fc.disable();
      } else {
        fc.enable();
      }
      group[field.fldname] = fc;
    });
    this.cform.fields = this.cform.fields.filter(x => x.type != 'file');
    //group['profile_pic'] = new FormControl('', []);
    this.profileForm = new FormGroup(group);
    //if (this.cform.profile_pic != "") {
    //  this.imageSrc = this.cform.profile
    //}
  }


  get f() { return this.profileForm.controls; }
  getOptionArray(options) {
    //return options.split('\r\n');
    return options.split(',');
  }

  closeprofile() {
    this.close.emit();
  }
  showError(message) {
    this.error = message;
    this.loading = false;
    this.submitted = false;
  }
  setLoading() {
    this.error = "";
    this.loading = true
    this.submitted = true;
  }
  unsetLoading() {
    this.error = "";
    this.loading = false;
  }
  resetLoading() {
    this.error = "";
    this.loading = false;
    this.submitted = false;
  }
  handleSuccess(logActivity) {
     if(logActivity==true)
    {
      this.statsService.trackActivity(this.webcast.webcast_id,'profile_complete');
    }
    this.close.emit();
   
  }
  onFileChange($event) {
    const reader = new FileReader();

    if ($event.target.files && $event.target.files.length) {
      let proxy = this;
      let file = $event.target.files[0];
      let width: number;
      let height: number;
      let img: any = document.createElement("img");
      let reader: any = new FileReader();
      reader.onload = function (e: any) { img.src = e.target.result; };
      reader.readAsDataURL(file);
      let imgs = new Image();
      img.onload = function (): void {
        width = this.width;
        height = this.height;
        proxy.onNewImg(height, width, img, file)
      };
      imgs.src = img.src;

    }
  }
  uploadProfilePic() {
    if (this.eleprofilepic) {
      this.eleprofilepic.nativeElement.click();
    }
  }

  // to create canvas and update our custom dimensions
  private onNewImg(height: any, width: any, img: any, file: any) {
    let canvas: HTMLCanvasElement = document.createElement("canvas");
    let ctx: any = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    let MAX_WIDTH: any = 150;
    let MAX_HEIGHT: any = 150;
    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }
    canvas.width = width;
    canvas.height = height;
    let ctx1 = canvas.getContext("2d");
    ctx1.drawImage(img, 0, 0, width, height);
    this.imageSrc = canvas.toDataURL("image/png");
    let blobBin = atob(this.imageSrc.split(',')[1]);
    let array = [];
    for (var i = 0; i < blobBin.length; i++) {
      array.push(blobBin.charCodeAt(i));
    }
    let newBlob = new Blob([new Uint8Array(array)], { type: 'image/png' });
    let newFile: any = this.createFile(this.imageSrc, file);
    if (this.profileForm.get('profile_pic')) {
      this.profileForm.get('profile_pic').setValue(newFile)
    }
    //this.uploadObj.upload(newFile, true);
  }
  // To create File object to upload
  public createFile(image: any, file: any) {
    let newFile = {
      filename: file.name,
      value: image,
      filesize: image.size,
      filetype: file.type,
    }
    return newFile;
  }
  showHideOthers($field) {
    //console.log($field);
    const control = this.profileForm.get($field);
    if (this.others.find(x => x = $field)) {
      return "d-block";
    }
    return "d-none";
  }
  changeOption($event: any, $field) {
    let selValue = $event.target.value;
    // || selValue == "Others"
    if (selValue == "Other") {
      this.others.push($field);
      const control = this.profileForm.get($field);
      control.patchValue("");
    } else {
      this.others = this.others.filter(x => x != $field);
      const control = this.profileForm.get($field);
      control.patchValue(selValue);
      control.updateValueAndValidity();
    }
  }

  isSelected(val,option)
  {
    return val == option? true:false;
  }
}
