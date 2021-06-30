import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router} from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AppStateService, AuthenticationService, CformService, WebcastService } from '../../app/_services';
import { first } from 'rxjs/operators';
import { AppState, Cform ,User, Webcast } from '../../app/_models';
import { ThemeService } from '../_services/theme.service';
import { Theme } from '../_models/theme.model';
import { CustomForm } from '../_models/custom-form';
@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  @Output() linkToRegister = new EventEmitter<any>();

  webcast: Webcast;
  theme: Theme;
  cform: CustomForm;
  loading = false;
  submitted = false;
  error = '';
  appState : AppState;

  loginForm: FormGroup;
  password_enable = false;
  otpEnable = false;
  longitude: number = 0.0;
  latitude: number = 0.0;
  loginFieldLabel:string = "";
  loginFieldType: string = "";
  otpVerificationfield: string = "";
  constructor(        
    private router: Router,
    private authenticationService: AuthenticationService, 
    private webcastService: WebcastService
    
  ) {}
  ngOnInit() {
    this.webcastService.webcast.subscribe(x => {
      if (x) {
        this.webcast = x;
        this.theme = x.theme;
        if (x.forms.length > 0) {
          this.cform = x.forms.find(x => x.form_name == 'login-form');
          this.renderFields();
        }
        
      }
    });
  }
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.setLoading();
    if (this.loginForm.invalid) {
      this.unsetLoading();
      return;
    }
    let pwd = "";
    if(this.password_enable == true){
        pwd=this.f.password.value;
    }

    this.authenticationService.login(this.f.login_field.value, pwd, this.webcast.webcast_id, this.latitude, this.longitude)
      .pipe(first())
      .subscribe(
        data => {
          if (data && data.error) {
            this.showError(data.error.message);
          }
          else {
            if (this.webcastService.hasWidget('loginByOTP')) {
              this.otpEnable = true;
              this.otpVerificationfield = this.f.login_field.value;
              this.resetLoading();
            } else {
              console.log("From Login");
              this.webcastService.redirectToHome(true);
            }
          }
        },
        error => {
          this.showError(error);
        });
  }
    
    renderFields() {
      let group: any = {};
      //in case the login field can be multiple fields like email/ mobile
      if (this.cform.fields.length > 1) {
        this.cform.fields.forEach(field => {
          this.loginFieldLabel = this.loginFieldLabel == "" ? field.label : this.loginFieldLabel + "/" + field.label;
          this.loginFieldType = "text";
        });
        group['login_field'] = new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$|^[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}$")]); 
      } else {
        let field = this.cform.fields[0];
        this.loginFieldLabel = field.label;
        this.loginFieldType = field.type;
        if (field.type == "email") {
          group['login_field'] = new FormControl('', [Validators.required, Validators.email]);
        } else if (field.type == "number"){
          group['login_field'] = new FormControl('', [Validators.required, Validators.pattern("^[1-9]{1}[0-9]{9}$")]);
        }
        else {
          group['login_field'] = new FormControl('', [Validators.required]);
        }
      }
      this.password_enable = this.webcast.password_enable;
      if (this.password_enable == true) {
        group['password'] = new FormControl('', [Validators.required]);
      }

      this.loginForm = new FormGroup(group);
    }

    getLocation(): void{
        if (navigator.geolocation) {
            
            navigator.geolocation.getCurrentPosition((position)=>{
                  this.longitude = position.coords.longitude;
                  this.latitude = position.coords.latitude;
             
                });
            }
        
  }
  onOtpVerified() {
    if (this.authenticationService.currentUserValue) {
      let x = this.authenticationService.currentUserValue;
      if (x) {
        if (x.hasProfile === true) {
          this.webcastService.redirectToHome(true);
        }
        else {
          this.router.navigate([`${this.webcast.webcast_id}/profile`]);
        }
      }

    }
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
    this.error = "";
    this.loading = false;
  }
  resetLoading() {
    this.error = "";
    this.loading = false;
    this.submitted = false;
  }


  hideOtpControl() {
    this.otpEnable = false;
  }
  onRegisterClick() {
    this.linkToRegister.emit();
  }


}
