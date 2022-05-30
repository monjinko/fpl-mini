import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  numberRegEx = /\-?\d*\.?\d{1,2}/;

  formData = new FormGroup({teamID: new FormControl('', [
    Validators.required,
    Validators.pattern(this.numberRegEx),
    Validators.minLength(4),
    Validators.maxLength(10),

  ]),});

  tID: number | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(){
    const value = this.formData.value;
    console.log(value);
  }

}
