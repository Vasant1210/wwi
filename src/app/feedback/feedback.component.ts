import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CustomFormService } from '../_services/custom-form.service';
import { WebcastService, CformService } from '../_services';
import { Cform } from '../_models';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})

export class FeedbackComponent implements OnInit {

  cform: Cform;
  feedBack: Cform;
  feedbackForm: FormGroup;
  fields = [];
  theme_color = "";
  theme_background = {};
  submitted = false;
  error = false;

  @Output() public close= new EventEmitter();

  constructor(private customFormService: CustomFormService, private cformService: CformService) {
    this.cformService.cform.subscribe(x => this.cform = x);
  }

  ngOnInit() {
    this.customFormService.getForm(this.cform.webcast_id, "feedback_form").subscribe(f => {
      this.feedBack = f;
      if (this.feedBack) {
        this.fields = this.feedBack.register_fields;
        if (this.fields && this.fields.length > 0)
          this.renderFields();
        this.theme_color = this.cformService.getThemeColor();
        this.theme_background = this.cformService.getThemeBackgroundStyle();
      }
    });
  }
  onSubmit() {
    //console.log(this.regForm);
    this.submitted = true;
    if (this.feedbackForm.invalid) {
      return;
    }
    let fieldsWithValue = [];
    for (const field in this.feedbackForm.controls) {
      const control = this.feedbackForm.get(field);
      let fld = {};
      let dbField = this.getFieldLabel(field);
      console.log("inside feedback component" + dbField);
      fld[dbField] = control.value;
      fieldsWithValue.push(fld);
    }
    this.customFormService.saveFeedback(this.cformService.getWebcastId(), JSON.stringify(fieldsWithValue), null, null)
      .subscribe(
        data => {
          if (data && (data.error || data.success)) {
            if (data.error) {
              this.error = data.error.message;
            } else {
              this.close.emit();
            }
          } else {
            this.close.emit();
          }
        },
        error => {
          this.error = error;
        }
      );
  }
  public checkError = (controlName: string, errorName: string) => {
    return this.feedbackForm.controls[controlName].hasError(errorName);
  }
  private getFieldLabel(fieldName) {
    let fld = "";

    if (this.feedBack && this.feedBack.register_fields) {
      console.log(this.feedBack.register_fields);
      this.feedBack.register_fields.forEach(function (obj) {
        console.log("field name" + fieldName);
        console.log(obj);
        if (obj['fldname'] == fieldName) {
          fld = obj['label'];
        }
      });
    }
    return fld;
  }
  renderFields() {
    let group: any = {};
    this.fields.forEach(field => {
      let validatorsArr = [];
      if (field.required == "true") {
        validatorsArr.push(Validators.required);
      } else if (field.type == "email") {
        validatorsArr.push(Validators.email);
      }
      group[field.fldname] = new FormControl('', validatorsArr)
      
    });
    this.feedbackForm = new FormGroup(group);
  }
  get f() { return this.feedbackForm.controls; }
  getOptionArray(options) {
    return options.split('\r\n');
  }

  closeFeedback() {
    this.close.emit();
  }
}
