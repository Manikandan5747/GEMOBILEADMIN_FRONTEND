import { I } from '@angular/cdk/keycodes';
import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { EventService } from 'src/app/service/event/event.service';

@Component({
  selector: 'app-add-edit-event-form',
  templateUrl: './add-edit-event-form.component.html',
  styleUrls: ['./add-edit-event-form.component.css']
})
export class AddEditEventFormComponent implements OnInit {
 

  @Input('action')
  action!: any;
  @Input('isShowErrors') isShowErrors!: boolean;
  public matcher = new ErrorMatcherService();
  errors = errorMessages;  // Used on form html.

  @Input('event_id') event_id!: any;



  public addEditForm!: FormGroup;
  EventList: any;
  mainEventList: any[] = [];
  
  miscMappingList: any;
  constructor(private fb: FormBuilder, private EventService: EventService) { }


  // convenience getter for easy access to form fields
  get f() {
    return this.addEditForm.controls;
  }

 ngAfterViewInit() {
  setTimeout(() => {
   

    if (this.event_id) {
      this.addEditForm.patchValue({
        event_id: this.event_id
      });
    }
  });
}


  
  async ngOnInit() {

    this.addEditForm = this.fb.group({
      event_type: ['', Validators.required],
      event_status: ["1"],
      main_event_status: ["1"],
      main_event_id:[''],
      event_detail: ['']

    });


    this.EventService.getActiveEvents().subscribe((data: any) => {
      this.EventList = data;

      if (this.event_id) {
        this.addEditForm.patchValue({
          event_id: this.event_id,
        });
      }
    });
  }
// loadMainEvents() {
//   this.EventService.getMainEvents().subscribe((res: any) => {
//     console.log('Main events loaded:', res);
//     this.mainEventList = res;
//      if (this.main_event_id) {
//       this.addEditForm.patchValue({
//         main_event_id: this.main_event_id
//       });
//     }

//   });
// }



}

   

   


  





 

 




