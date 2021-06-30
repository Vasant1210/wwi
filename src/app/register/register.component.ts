import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { CformService, AuthenticationService, WebcastService } from '../../app/_services';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Webcast } from '../_models';
import { Router } from '@angular/router';
import { Theme } from '../_models/theme.model';
import { CustomForm } from '../_models/custom-form';
import { PerfectScrollbarModule, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Output() linkToLogin = new EventEmitter<any>();
  cform: CustomForm;
  cloginForm: CustomForm;
  webcast: Webcast;
  theme: Theme;
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarDirective ;
  submitted = false;
  error = "";
  loading = false;

  regForm: FormGroup;
  page_mode = "registerForm";  //verifyotp , thankyou
  loginFieldCredentitals = "";
  others: string[] = [];
  showValidationSummary = true;
  constructor(
    private authService: AuthenticationService,
    private webcastService: WebcastService,
    private router: Router
  ) { }

  ngOnInit() {
    this.webcastService.webcast.subscribe(x => {
      if (x) {
        this.webcast = x;
        this.theme = x.theme;
        if (x.forms.length > 0) {
          this.cform = x.forms.find(x => x.form_name == 'reg-form');
          this.cloginForm = x.forms.find(x => x.form_name == 'login-form');
          this.renderFields();
        }
      }
    });
  }


  get f() { return this.regForm.controls; }

  onSubmit() {
    this.setLoading();
    if (this.regForm.invalid) {
      this.unsetLoading();
      return;
    }
    let fieldsWithValue = [];
    let lngfieldNames = this.getLoginFieldName();
    let lgnFieldValue = [];
    for (const field in this.regForm.controls) {
      const control = this.regForm.get(field);
      let fld = {};
      let dbField = this.getFieldLabel(field);
      fld[dbField] = control.value;
      if (lngfieldNames.indexOf(field) >= 0) {
        lgnFieldValue.push(control.value);
      }
      fieldsWithValue.push(fld);
    }
    let longitude = 0;
    let latitude = 0;
    /*if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        longitude = position.coords.longitude;
        latitude = position.coords.latitude;

      });
    }*/
    this.authService.register(lgnFieldValue.join(','), this.webcast.webcast_id, JSON.stringify(fieldsWithValue), longitude, latitude)
      .subscribe(
        data => {
          if (data && (data.error || data.success)) {
            if (data.error) {
              this.showError(data.error.message);
            } else if (data.success) {
              if (data.success.code == "001" && this.webcastService.hasWidget('reg_verify')) {
                this.resetLoading();
                this.loginFieldCredentitals = lgnFieldValue.join(',');
                this.page_mode = "verifyOtp";
              }
              else {
                this.resetLoading();
                this.page_mode = "thankyou";
              }
            }
          } else {
            if (this.webcast.status == 'live' || this.webcast.status == 'ready') {
              this.webcastService.redirectToHome(true);
            }
            else if (this.webcast.status == 'publish') {
              this.resetLoading();
              this.page_mode = "thankyou";
            } else {
              this.resetLoading();
              this.page_mode = "registerForm";
            }
          }
        },
        error => {
          this.showError(error);
        }
      );
  }
  hideOtpControl() {
    this.page_mode = "registerForm";
  }
  onOtpVerified() {
    this.router.navigate([`${this.webcast.webcast_id}/profile`]);
  }
  renderFields() {
    let group: any = {};
    this.cform.fields.forEach(field => {
      let validatorsArr = [];
      if (field.required == "true") {
        validatorsArr.push(Validators.required);
      }
      if (field.type == "email") {
        validatorsArr.push(Validators.pattern("^[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}$"));
      }
      if (field.type == "number") {
        validatorsArr.push(Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"));
      }
      
      if (field.loginfield == "true") {
        group[field.fldname] = new FormControl('', validatorsArr);
      } else {
        group[field.fldname] = new FormControl('', validatorsArr)
      }
    });
    this.regForm = new FormGroup(group);
  }
  public checkError = (controlName: string, errorName: string) => {
    return this.regForm.controls[controlName].hasError(errorName);
  }
  changeOption($event: any, $field) {
    let selValue = $event.target.value;
    if (selValue == "Other" || selValue == "Others") {
      this.others.push($field);
      const control = this.regForm.get($field);
      control.patchValue("");
    } else {
      this.others = this.others.filter(x => x != $field);
      const control = this.regForm.get($field);
      control.patchValue(selValue);
    }
  }
  showHideOthers($field) {
    //console.log($field);
    const control = this.regForm.get($field);
    if (this.others.find(x => x = $field)) {
      return "d-block";
    }
    return "d-none";
  }
  getOptionArray(options) {

    return options.split(',');
  }
  getLoginFieldName() {
    let fld = [];
    if (this.cloginForm.fields.length > 0) {
      this.cloginForm.fields.forEach(x => {
        fld.push(x.fldname);
      });
      return fld;
    }
  }
  public getFieldLabel(fieldName) {
    let fld = "";
    if (this.cform.fields.length > 0) {
      this.cform.fields.forEach(function (obj) {
        if (obj['fldname'] == fieldName) {
          fld = obj['label'];
        }
      });
      return fld;
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
  onLoginClick() {
    this.linkToLogin.emit();
  }
}
