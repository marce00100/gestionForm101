import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SFormService } from 'src/app/shared/sform.service';

@Component({
  selector: 'app-view-form-filled',
  templateUrl: './viewform.component.html',
  styleUrls: ['./viewform.component.scss'],
})
export class ViewformComponent implements OnInit {

  constructor(public sform: SFormService, private routeurl: ActivatedRoute) { }

  ngOnInit() {
    
  }



}
