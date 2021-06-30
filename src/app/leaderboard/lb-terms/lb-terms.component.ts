import { Component, OnInit,Input } from '@angular/core';


@Component({
  selector: 'app-lb-terms',
  templateUrl: './lb-terms.component.html',
  styleUrls: ['./lb-terms.component.css']
})
export class LbTermsComponent implements OnInit {
  @Input() tnc:string; 
 
 
 
  constructor() { }

  ngOnInit(): void { }

}
