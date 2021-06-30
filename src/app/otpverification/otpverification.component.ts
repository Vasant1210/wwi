import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthenticationService, WebcastService } from '../_services';
import { Webcast } from '../_models';
import { Theme } from '../_models/theme.model';
import { ThemeService } from '../_services/theme.service';

@Component({
  selector: 'app-otpverification',
  templateUrl: './otpverification.component.html',
  styleUrls: ['./otpverification.component.scss']
})
export class OtpverificationComponent implements OnInit {
  txtOTP = new FormControl('', [Validators.required, Validators.pattern("^[0-9]{6}$")]);
  @Input() loginField: string;
  @Output() onSuccess = new EventEmitter<any>();
  @Output() onBack = new EventEmitter<any>();
  @Output() onResend = new EventEmitter<any>();
  submitted = false;
  loading = false;
  error = "";
  webcast: Webcast;
  theme: Theme;
  resendMsg: boolean = false;
  constructor(private authService: AuthenticationService, private webcastService: WebcastService, private themeService: ThemeService) {
    this.webcastService.webcast.subscribe(x => { this.webcast = x; });
    this.themeService.theme.subscribe(x => { this.theme = x; })
    
  }

  ngOnInit(): void {
    this.resendMsg = false;
  }

  onSubmit() {
    this.setLoading();
    if (!this.txtOTP.valid) {
      this.unsetLoading();
      return;
    }
    this.authService.verfiyOTP(this.txtOTP.value, this.loginField, this.webcast.webcast_id).subscribe(data => {
      if (data.error) {
          this.showError(data.error.message);
        } else {
          this.resetLoading();
          this.onSuccess.emit();
        } 
    },
      error => {
        this.showError(error);
    });
  }
  public checkError(errorName: string) {
    //console.log(this.txtOTP.hasError(errorName));
    return this.txtOTP.hasError(errorName);
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
  resetLoading() {
    this.error = "";
    this.loading = false;
    this.submitted = false;
  }
  close() {
    this.onBack.emit();
  }

  resend() {
    this.resendMsg = true;
    this.onResend.emit();
    
  }
}
