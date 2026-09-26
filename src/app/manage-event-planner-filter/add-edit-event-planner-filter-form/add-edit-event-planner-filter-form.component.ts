import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { EventService } from 'src/app/service/event/event.service';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { MatDialog } from '@angular/material/dialog';
import { AddEditEventQueryFormComponent } from 'src/app/manage-event-query/add-edit-event-query-form/add-edit-event-query-form.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AddEditEventFormComponent } from 'src/app/manage-event/add-edit-event-form/add-edit-event-form.component';

@Component({
  selector: 'app-add-edit-event-planner-filter-form',
  templateUrl: './add-edit-event-planner-filter-form.component.html',
  styleUrls: ['./add-edit-event-planner-filter-form.component.css']
})
export class AddEditEventPlannerFilterFormComponent implements OnInit {

  @Input() action!: any;
  @Input() isShowErrors!: boolean;
  @Input() parameter_id!: any;
  @Input() query_id: any;
  @Input() event_planner_id: any;

  public matcher = new ErrorMatcherService();
  public errors = errorMessages;

  public addEditForm!: FormGroup;

  queryList: any[] = [];
  filteredQueryList: any[] = [];
  querySearch: string = '';

  parameterList: any[] = [];
  EventList: any[] = [];

  parameterConditionList = [
    { value: 'Equal to', label: 'Equal to' },
    { value: 'Not Equal to', label: 'Not Equal to' },
    { value: 'Greater than', label: 'Greater than' },
    { value: 'Less than', label: 'Less than' },
    { value: 'Greater than or Equal to', label: 'Greater than or Equal to' },
    { value: 'Less than or Equal to', label: 'Less than or Equal to' },
    { value: 'LIKE', label: 'Like' }
  ];

  parameterConjunctionList = [
    { value: 'AND', label: 'AND' },
    { value: 'OR', label: 'OR' },
    { value: 'ONLY', label: 'ONLY' }
  ];

constructor(
  private fb: FormBuilder,
  private EventService: EventService,
  private route: ActivatedRoute,
  private dialog: MatDialog
) {}

 
ngOnInit(): void {
  this.addEditForm = this.fb.group({
    parameter_desc: ['', Validators.required],
    parameter_text: ['', Validators.required],
    parameter_value: ['', Validators.required],
    parameter_conjunction: ['', Validators.required],
    parameter_condition: ['', Validators.required],
    status: ['1'],
    event_planner_id: ['', Validators.required],
    query_id: ['', Validators.required]
  });

  // Get route parameters
  this.route.params.subscribe(params => {
    if (params['eventPlannerId']) {
      this.event_planner_id = params['eventPlannerId'];
      this.addEditForm.get('event_planner_id')?.setValue(this.event_planner_id);
    }

    if (params['queryId']) {
      this.query_id = params['queryId'];
      this.addEditForm.get('query_id')?.setValue(this.query_id);
      this.loadParameters(this.query_id);
    }
  });

  this.loadQueries();
  this.loadEventPlanners();

  this.addEditForm.get('query_id')?.valueChanges.subscribe((queryId) => {
    if (queryId && queryId !== 'new') {
      this.loadParameters(queryId);
    }
  });
}


  loadQueries() {
    this.EventService.getActiveQuery().subscribe(
      (res: any) => {
        this.queryList = res;
        this.filteredQueryList = [...this.queryList];
      },
      (error) => {
        console.error('Error loading queries', error);
      }
    );
  }

  loadParameters(queryId: number) {
    this.EventService.getActiveEventparametername(queryId).subscribe(
      (res: any) => {
        this.parameterList = res;
      },
      (error) => {
        console.error('Error loading parameters', error);
      }
    );
  }

  loadEventPlanners() {
    this.EventService.getActiveEventPlanner().subscribe(
      (res: any) => {
        this.EventList = res;
        if (this.event_planner_id) {
          this.addEditForm.patchValue({
            event_planner_id: this.event_planner_id
          });
        }
      },
      (error) => {
        console.error('Error loading event planners', error);
      }
    );
  }

  filterQueries() {
    const search = this.querySearch.toLowerCase();
    this.filteredQueryList = this.queryList.filter((item) =>
      item.query_name.toLowerCase().includes(search)
    );
  }

  onQueryDropdownOpened(opened: boolean) {
    if (!opened) {
      this.querySearch = '';
      this.filteredQueryList = [...this.queryList];
    }
  }


  openCreateQueryDialog() {
    const dialogRef = this.dialog.open(AddEditEventFormComponent, {
      width: '800px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.query_id) {

        this.queryList.push(result);
        this.filteredQueryList = [...this.queryList];
        this.addEditForm.patchValue({ query_id: result.query_id });
      } else if (result && result.query_name) {
    
        this.loadQueries();
      }
    });
  }
}
