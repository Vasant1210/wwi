import { Component, OnInit,Input, SimpleChange, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-ez-products',
  templateUrl: './ez-products.component.html',
  styleUrls: ['./ez-products.component.css']
})
export class EzProductsComponent implements OnInit {
  @Input() products:string[]=[];  
  @Output() onClose = new EventEmitter<any>();

constructor() { }

  ngOnInit(): void {   
  }

  ngOnChanges(changes: SimpleChange) {    
     
  }
  closePopup()
  {
    this.onClose.emit();
  }

}
