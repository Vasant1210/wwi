import { Component, OnInit, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-app-loader',
  templateUrl: './app-loader.component.html',
  styleUrls: ['./app-loader.component.css']
})
export class AppLoaderComponent implements OnInit {
  @Input() loading: boolean;
  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    if (this.loading) {
      this.spinner.show();
    } else
      this.spinner.hide();
  }

}
