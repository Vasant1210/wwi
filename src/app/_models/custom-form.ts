export class CustomForm {
  webcastId:string; // id of the webcast
  title:string; //title of the form
  fields: FormField[];
  form_name = '';
  status = '';
}

export class FormField {
  fldname: string;
  haslabel: string;
  label: string;
  loginfield: string;
  options: string;
  placeholder: string;
  required: string;
  type: string;
  value: any;
  disabled: string;
}
