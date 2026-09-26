import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';
import { AddEventTemplateFormComponent } from 'src/app/manage-event-template/add-event-template-form/add-event-template-form.component';
import { EditEventTemplateFormComponent } from 'src/app/manage-event-template/edit-event-template-form/edit-event-template-form.component';
import { AddManageEventComponent } from 'src/app/manage-event/add-manage-event/add-manage-event.component';
import { CookieService } from 'src/app/service/cookie.service';
import { EventService } from 'src/app/service/event/event.service';
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-edit-event-planner-form',
  templateUrl: './add-edit-event-planner-form.component.html',
  styleUrls: ['./add-edit-event-planner-form.component.css']
})
export class AddEditEventPlannerFormComponent implements OnInit, OnDestroy {
  @Input() event_planner_id!: number;
  @Input() event_id!: any;
  @Input() template_id!: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  plannerDetailsExpanded: boolean = true;  
  filterDetailsExpanded: boolean = true;
  isShowErrors: boolean = false;   
  isEditMode: boolean = false;
  today: Date = new Date();
  minEndDate: Date | null = null;
  
  filteredTemplateList: any[] = [];
  expiryDaysControl = new FormControl('', [Validators.required]);
  isExpiryInvalid: boolean = false;
  expiryErrorText: string = '';
  maxExpiryDays: number = 0;
  selectedTemplate: any = null;
  missingPlaceholders: string[] = [];
  queryText: any;

  
  mandatoryFields: string[] = [
    '@Nationality',
    '@Phoneno',
    '@Email',
    '@MobileAppRegisterationStatus',
    '@CustomerCategoryName',
    '@CustomerName',
    '@Company',
    '@CustomerCode'
  ];

  public matcher = new ErrorMatcherService();
  errors = errorMessages;

  public addEditForm!: FormGroup;
  
  private destroy$ = new Subject<void>();

  // Dropdown Lists
  EventList: any[] = [];
  TemplateList: any[] = [];
  countryList: any[] = [];
  isLoading = false;


  // File Upload
  selectedEventFile: File | null = null;
selectedBannerFile: File | null = null;
  imageBase64: string | ArrayBuffer | null = null;
  bannerImageBase64: string | ArrayBuffer | null = null;
  existingImageUrl: string | ArrayBuffer | null = null;

  // Filter related
  fieldSearch: string[] = [];
  filteredFieldList: any[][] = [];
  queryList: any[] = [];
  filteredQueryList: any[] = [];
  querySearch: string = '';
  selectedQueryText: string = '';
  baseQueryText: string = '';
  parameterList: any[] = [];
  minDate: Date = new Date();
  queryCount: number | null = null;
queryValid: boolean = false;
isQueryLoading: boolean = false; 
  
  selectedEventName: string = '';


  // Value Lists
  filteredValueList: { sDefaultValue: string }[][] = [];
  parameterValueList: { sDefaultValue: string }[][] = [];
  valueSearch: string[] = [];
  manualValueAllowed: boolean[] = [];

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

  dataSource = new MatTableDataSource<any>([]);
  mainFieldList: any[] = [];
  selectedQueryTableName!: string;
  userid: any;
  currentUser: any;
  isLoadingData: boolean = false;
  errorlogService: any;
  eventPlannerId: any;
  filters: any;
  filteredList: any;
  eventSearch: any;
  templateSearch: any;
  countrySearch: any;
  filteredCountryList: any;
  months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

days: number[] = [];

displayDate: string = ''; // or 'Select Date'
selectedMonth: number | null = null;
selectedDay: number | null = null;
apiKey: string = 'a4db08b7-5729-4ba9-8c08-f2df493465a1';
selectedYear: number = new Date().getFullYear();

showMonthDayPicker = false;
isCalendarDayInvalid: boolean = false;
calendarErrorText: string = '';
calendarDayControl: any;
    List: any;
    filteredResults: string[] = [];
    foundFields: string[] = [];



  constructor(
    private fb: FormBuilder, 
    private EventService: EventService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private cookieService: CookieService,
    private http: HttpClient
  ) {}

 ngOnInit(): void {
  const today = new Date();
  this.today.setHours(0, 0, 0, 0);


  if (this.selectedMonth === null) this.selectedMonth = today.getMonth();
  if (this.selectedDay === null) this.selectedDay = today.getDate();

  this.updateDays();         
  this.updateDisplayDate();  

 
  this.initializeForm();
  
  this.loadInitialData();
  this.setupFormSubscriptions();
  this.loadQueries();
this.addEditForm.get('calendar_day')?.valueChanges.subscribe(value => {
  this.validateCalendarDay(value);

});
  this.addEditForm.get('event_start_date')?.valueChanges.subscribe((value) => {
    this.validateCalendarDay(value);
    
  });
  this.addEditForm.get('event_end_date')?.valueChanges.subscribe((value) => {
    this.validateCalendarDay(value);
   
  });
 this.addEditForm.get('calendar_day')?.valueChanges.subscribe(() => this.validateExpiryDays());
  this.addEditForm.get('event_end_date')?.valueChanges.subscribe(() => this.validateExpiryDays());
  this.addEditForm.get('event_planner_expiry_days')?.valueChanges.subscribe(() => this.validateExpiryDays());
  this.expiryDaysControl.valueChanges.subscribe(() => {
  this.validateExpiryDays();
});
  this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');

  const routeId = Number(this.route.snapshot.paramMap.get('eventPlannerId'));
  this.eventPlannerId = routeId || this.EventService.getPlannerId();
  this.addEditForm.get('schedule_id')?.valueChanges.subscribe(value => {
  if (value === '1') {
    this.addEditForm.get('iseventyearly')?.setValue(true);
  }
}); 




  if (this.eventPlannerId) {
    this.isEditMode = true;
   // this.loadEventPlannerData(this.eventPlannerId);
  } else {
    this.isEditMode = false;
    this.isLoadingData = false; 
  }
}


  get parameters(): FormArray {
    return this.addEditForm.get('parameters') as FormArray;
  }

onTemplateDropdownOpened(opened: boolean) {
  if (!opened) {
    this.templateSearch = '';
    this.filteredTemplateList = [...this.TemplateList];
  } else {
    const templateId = this.addEditForm.value.template_id;
    if (templateId) {
      this.onTemplateChangeById(templateId);
    }
  }
}


onEventEndDateChange() {
  this.clearExpiryAndCalendar();
}

clearExpiryAndCalendar() {
  if (this.addEditForm.controls['event_expiry_days']) {
    this.addEditForm.controls['event_expiry_days'].setValue(null);
  }
  if (this.addEditForm.controls['calendar_day']) {
    this.addEditForm.controls['calendar_day'].setValue(null);
  }
}


onTemplateChangeById(templateId: any) {
  if (!templateId) return;

  const selectedTemplate = this.filteredTemplateList.find(t => t.template_id === templateId);
  if (!selectedTemplate) return;

  const templateName = selectedTemplate.template_name;

  const headers = new HttpHeaders({ apikey: this.apiKey });
  this.http.get<any>(
    `${CommonConstants.WEBAPI_URL}/api/listeventtemplatebyname/${encodeURIComponent(templateName)}`,
    { headers }
  )
  .subscribe({
    next: (response) => {
      if (response && response.length > 0) {
        this.selectedTemplate = response[0];
      } else {
        Swal.fire('Not Found', `No template found for ${templateName}`, 'warning');
      }
    },
    error: (err) => {
      Swal.fire('Error', 'Failed to fetch updated template', 'error');
    }
  });
}


onTemplateSelect(templateId: string) {
  
  if (!templateId) {
    this.selectedTemplate = null;
    return;
  }

  this.onTemplateChangeById(templateId);



  const found = this.filteredTemplateList.find(t => t.template_id === templateId);
  if (found) {
    this.selectedTemplate = {
      ...found,
      mode_of_message: Array.isArray(found.mode_of_message)
        ? found.mode_of_message
        : found.mode_of_message ? [found.mode_of_message] : [],
      dynamicColumns: found.dynamicColumns || []
    };
  } else {
    this.selectedTemplate = null;
  }
}

isYearlyChecked(): boolean {
  return this.addEditForm.get('iseventyearly')?.value;
}



validateExpiryDays() {
  const ctrl = this.addEditForm.get('event_planner_expiry_days');
  if (!ctrl) return; 

  const startDate = new Date(this.addEditForm.value.event_start_date);
  const endDate = new Date(this.addEditForm.value.event_end_date);

  const expiryValue = ctrl.value;

 
  const diffTime = endDate.getTime() - startDate.getTime();
  const maxExpiryDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 

  if (expiryValue > maxExpiryDays) {
    this.isExpiryInvalid = true;
    this.expiryErrorText = `Expiry cannot exceed ${maxExpiryDays} days.`;
    ctrl.setErrors({ invalidExpiry: true });
  } 
  else if (expiryValue < 1) {
    this.isExpiryInvalid = true;
    this.expiryErrorText = `Expiry cannot exceed ${maxExpiryDays} day.`;
    ctrl.setErrors({ invalidExpiry: true });
  } 
  else {
    this.isExpiryInvalid = false;
    this.expiryErrorText = '';
    ctrl.setErrors(null);
  }
}



validateCalendarDay(value: string | Date) {
  const ctrl = this.addEditForm.get('calendar_day'); 
  const startDate = new Date(this.addEditForm.value.event_start_date);
  const endDate = new Date(this.addEditForm.value.event_end_date);
  const calendarDay = new Date(value);

  const startKey = startDate.getMonth() * 100 + startDate.getDate();
  const endKey = endDate.getMonth() * 100 + endDate.getDate();
  const calKey = calendarDay.getMonth() * 100 + calendarDay.getDate();

  let invalid = false;

  if (startDate.getFullYear() === endDate.getFullYear()) {
    if (calKey <= startKey || calKey >= endKey) invalid = true;
  } else {
    if (calKey < startKey && calKey > endKey) invalid = true;
  }
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];


 if (invalid) {
  this.isCalendarDayInvalid = true;
  this.calendarErrorText = `Calendar day must be after ${startDate.getDate()}-${monthNames[startDate.getMonth()]} and on or before ${endDate.getDate()}-${monthNames[endDate.getMonth()]}.`;

  ctrl?.setErrors({ invalidCalendarDay: true });
} else {
  this.isCalendarDayInvalid = false;
  this.calendarErrorText = '';
  ctrl?.setErrors(null);
}
}


isYearlyReadOnly(): boolean {
  const scheduleId = this.addEditForm.get('schedule_id')?.value;
  return scheduleId === '1';
}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
filterTemplates() {
  const search = this.templateSearch.toLowerCase();
  this.filteredTemplateList = this.TemplateList.filter(item =>
    item.template_name.toLowerCase().includes(search)
  );
}
loadTemplates(callback?: () => void): void {
  this.EventService.getActiveTemplate()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: any) => {
        this.TemplateList = res || [];
        this.filteredTemplateList = [...this.TemplateList]; 
        if (callback) callback();  
        this.patchTemplateValueIfReady(); 
      },
      error: (err) => console.error('Error loading templates:', err)
    });
}
blockNonNumeric(event: KeyboardEvent) {
  const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
  if (!/[0-9]/.test(event.key) && !allowedKeys.includes(event.key)) {
    event.preventDefault();
  }

  const input = event.target as HTMLInputElement;
  if (event.key === '0' && input.value.length === 0) {
    event.preventDefault();
  }
}
openCreateTemplateDialog() {
  const dialogRef = this.dialog.open(AddEventTemplateFormComponent, {
    width: '950px',
    disableClose: true,
    data: {}
  });
 dialogRef.afterClosed().subscribe(result => {
  if (result && result.newTemplateId) {
    this.loadTemplates(() => {
      this.addEditForm.controls['template_id'].setValue(result.newTemplateId);
      this.onTemplateChangeById(result.newTemplateId);
      console.log("template_id", result.newTemplateId)
    });
  }
});

}
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private initializeForm(): void {
    this.addEditForm = this.fb.group({
      event_planner_title: ['', Validators.required],
      schedule_id: ['1'],
      schedule_type: ['Periodic'],
      event_planner_status: ['1'],
      event_id: ['', Validators.required],
      template_id: ['', Validators.required],
       event_planner_expiry_days: [
          '',
          [
            Validators.required,
            Validators.pattern("^[1-9][0-9]*$") // only positive integers
          ]
        ],
      event_start_date: ['', Validators.required],
      event_end_date: ['', [Validators.required, this.endDateValidator.bind(this)]],
      iseventyearly: [true, Validators.required],

      calendar_day: [null, Validators.required],
      event_planner_image: [''],
      mode_of_message: [['Push'], this.atLeastOneSelected()],
      //parameters: this.fb.array([], this.parametersNotEmptyValidator()),
      //parameter_desc: ['', Validators.required],
      status: ['1'],
      event_planner_id: [''],
      query_text: ['', Validators.required],
      //query_id: ['', Validators.required]
    });
  }

  private loadInitialData(): void {
  
     this.loadTemplates();
   
    this.loadQueries();
    this.loadEvents();
     this.loadCountry();
  }
 private patchTemplateValueIfReady(): void {
    if (this.template_id && this.TemplateList.length > 0) {
      const template = this.TemplateList.find(t => t.template_id === this.template_id);
      if (template) {
        this.addEditForm.patchValue({ template_id: this.template_id });
      }
    }
  }
 private setupFormSubscriptions(): void {
  this.addEditForm.get('schedule_id')?.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe((value) => {
      const scheduleType = value === '1' ? 'Periodic' : 'Manual';
      this.addEditForm.get('schedule_type')?.setValue(scheduleType, { emitEvent: false });

      const yearlyControl = this.addEditForm.get('iseventyearly');
      if (value === '1') {  
        yearlyControl?.setValidators([Validators.required]);
        yearlyControl?.setValue(true);
      } else {  
        yearlyControl?.clearValidators();
      }
      yearlyControl?.updateValueAndValidity();
    });

  this.addEditForm.get('event_start_date')?.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe((startDate) => {
      this.minEndDate = startDate ? new Date(startDate) : new Date();
      this.addEditForm.controls['event_end_date'].updateValueAndValidity();
    });
}

  private handleRouteParams(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = Number(params.get('eventPlannerId'));
        if (id) {
          this.event_planner_id = id;
         // this.loadEventPlannerData(id);
        }
      });
  }
filterCountries() {
  const search = this.countrySearch.toLowerCase();
  this.filteredCountryList = this.countryList.filter(c =>
    c.country_name.toLowerCase().includes(search)
  );
}

openCreateEventDialog(): void {
  const dialogRef = this.dialog.open(AddManageEventComponent, {
    width: '600px',
    disableClose: true
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result?.data?.event_id) { 
      const newEvent = result.data;

      const exists = this.EventList.some(t => t.event_id === newEvent.event_id);
      if (!exists) {
        this.EventList = [newEvent, ...this.EventList];
      }

      this.filteredList = [...this.EventList];
      this.addEditForm.get('event_id')?.setValue(newEvent.event_id);

      this.selectedEventName = newEvent.event_type;

      this.cd.detectChanges();
    }
  });
}
// 2. Fix loadEventPlannerData() - Parse dates and query_text correctly
// loadEventPlannerData(eventPlannerId: number): void {
//   this.isLoadingData = true;

//   this.EventService.getEventPlannerFiltersById(eventPlannerId)
//     .pipe(takeUntil(this.destroy$))
//     .subscribe({
//       next: (response: any) => {
//         const plannerData = response?.data || response;
        
//         if (!plannerData) {
//           Swal.fire({
//             icon: 'error',
//             title: 'Error',
//             text: 'Event Planner not found',
//             confirmButtonText: 'OK'
//           }).then(() => this.router.navigate(['/event_planner']));
//           return;
//         }

//         // Store existing image URL
//         this.existingImageUrl = plannerData.event_planner_image || '';
     
//         // Parse mode_of_message
//         let modeOfMessage = plannerData.mode_of_message || ['Push'];
//         if (typeof modeOfMessage === 'string') {
//           try {
//             modeOfMessage = JSON.parse(modeOfMessage);
//           } catch (e) {
//             modeOfMessage = ['Push'];
//           }
//         }

//         let scheduleId = '1';
//         if (plannerData.schedule_type) {
//           scheduleId = plannerData.schedule_type === 'Periodic' ? '1' : '0';
//         } else if (plannerData.schedule_id) {
//           scheduleId = plannerData.schedule_id.toString();
//         }

//         const startDate = plannerData.event_start_date ? new Date(plannerData.event_start_date) : null;
//         const endDate = plannerData.event_end_date ? new Date(plannerData.event_end_date) : null;
//         const calendarDay = plannerData.calendar_day ? new Date(plannerData.calendar_day) : null;

//         let isYearly = plannerData.iseventyearly;
//         if (typeof isYearly === 'string') {
//           isYearly = isYearly === 'true' || isYearly === '1';
//         }


//         // Update calendar display
//         if (calendarDay) {
//           this.selectedMonth = calendarDay.getMonth();
//           this.selectedDay = calendarDay.getDate();
//           this.updateDays();
//           this.updateDisplayDate();
//         }

//         this.selectedQueryText = plannerData.query_preview || plannerData.query_text || '';
//         this.baseQueryText = this.selectedQueryText;

//         this.isLoadingData = false;
//       },
     
//     });
// }
onStartDateChange(event: any) {
  const startDate = event.value;

  this.clearExpiryAndCalendar();

  if (startDate) {
    this.minEndDate = new Date(startDate);
    this.minEndDate.setDate(this.minEndDate.getDate() + 1);

    const endDate = this.addEditForm.get('event_end_date')?.value;
    if (endDate && endDate <= startDate) {
      this.addEditForm.get('event_end_date')?.reset();
    }
  }
}
 endDateValidator(control: AbstractControl) {
    const startDate = this.addEditForm?.controls['event_start_date'].value;
    const endDate = control.value;
    if (startDate && endDate && endDate < startDate) {
      return { minDate: true };
    }
    return null;
  }
  
  loadFiltersFromData(filters: any[]): void {
    if (!filters || filters.length === 0) {
      this.isLoadingData = false;
      return;
    }

    const queryId = filters[0].query_id;
    
    // Patch query_id and parameter_desc
    this.addEditForm.patchValue({
      query_id: queryId,
      parameter_desc: filters[0].parameter_desc || ''
    }, { emitEvent: false });

    // // Load parameter list for the query
    // this.EventService.getActiveEventparametername(queryId)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (params: any) => {
    //       this.parameterList = params || [];

    //       // const parametersArray = this.parameters;
    //       // parametersArray.clear();

    //       // Add each filter as a parameter
    //       filters.forEach((filter: any, index: number) => {
    //         const conditionGroup = this.fb.group({
    //           parameter_id: [filter.parameter_id || ''],
    //           opening_bracket: [filter.opening_bracket || ''],
    //           parameter_text: [filter.parameter_text || '', Validators.required],
    //           parameter_condition: [filter.parameter_condition || '', Validators.required],
    //           parameter_value: [filter.parameter_value || '', Validators.required],
    //           closing_bracket: [filter.closing_bracket || ''],
    //           table_name: [''],
    //           field_name: [''],
    //           parameter_conjunction: [filter.parameter_conjunction || '', Validators.required]
    //         });

    //        // this.subscribeToConditionChanges(conditionGroup);
    //         // parametersArray.push(conditionGroup);

    //         // Initialize filtered lists for each parameter
    //         this.filteredFieldList[index] = [...(this.parameterList || [])];
    //         this.filteredValueList[index] = [];
    //         this.parameterValueList[index] = [];
    //         this.valueSearch[index] = '';
    //         this.manualValueAllowed[index] = false;
    //         this.fieldSearch[index] = '';

    //         // Find matching parameter to get table_name and field_name
    //         const matchingParam = this.parameterList.find(
    //           (p: any) => p.field_name === filter.parameter_text
    //         );

    //         if (matchingParam) {
    //           conditionGroup.patchValue({
    //             table_name: matchingParam.table_name,
    //             field_name: matchingParam.field_name
    //           }, { emitEvent: false });

    //           // Load values for this field
    //           this.loadFieldValuesForIndex(index, matchingParam.table_name, matchingParam.field_name);
    //         }
    //       });

    //       // Load query preview
    //      // this.onQuerySelected(queryId);
    //       this.isLoadingData = false;
    //     },
    //     error: (err) => {
    //       console.error('Error loading parameters:', err);
    //       this.isLoadingData = false;
    //     }
    //   });
  }
onCountryDropdownOpened(opened: boolean) {
  if (opened) {
    this.filteredCountryList = [...this.countryList];
  } else {
    this.countrySearch = '';
  }
}

  loadFieldValuesForIndex(index: number, tableName: string, fieldName: string): void {
    this.EventService.getEventsFieldValues(tableName, fieldName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const raw = res?.records?.[0]?.sDefaultValue || '';
          const rawValues = raw ? raw.split(',').map(v => v.trim()) : [];
          const values = rawValues.filter((_, i) => i % 2 === 1);
          const valueObjects = values.map(v => ({ sDefaultValue: v }));

          this.filteredValueList[index] = [...valueObjects];
          this.parameterValueList[index] = [...valueObjects];
          this.manualValueAllowed[index] = valueObjects.length === 0;
        },
        error: (err) => {
          console.error('Error fetching field values:', err);
          this.manualValueAllowed[index] = true;
        }
      });
  }

  // createParameterGroup(param?: any): FormGroup {
  //   return this.fb.group({
  //     parameter_id: [param?.parameter_id || ''],
  //     parameter_desc: [param?.parameter_desc || '', Validators.required],
  //     parameter_text: [param?.parameter_text || '', Validators.required],
  //     parameter_condition: [param?.parameter_condition || '', Validators.required],
  //     parameter_conjunction: [param?.parameter_conjunction || ''],
  //     parameter_value: [param?.parameter_value || '', Validators.required],
  //     opening_bracket: [param?.opening_bracket || ''],
  //     closing_bracket: [param?.closing_bracket || ''],
  //     query_name: [param?.query_name || ''],
  //     table_name: [param?.table_name || ''],
  //     field_name: [param?.field_name || '']
  //   });
  // }

 loadEvents(): void {
   this.EventService.getActiveEvents()
     .pipe(takeUntil(this.destroy$))
     .subscribe({
       next: (res: any) => {
         this.EventList = res?.data || res || [];
         this.filteredList = this.EventList;
 
 
         if (this.event_id && this.addEditForm) {
           const found = this.EventList.find(e => e.event_id == this.event_id);
           if (found) {
             this.addEditForm.patchValue({ event_id: found.event_id });
           }
         }
 
         this.cd.detectChanges();
       },
       error: (err) => console.error('Error loading events:', err)
     });
 }


  loadCountry(): void {
    this.EventService.getCountry()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.countryList = res?.data || [];
          this.filteredCountryList = [...this.countryList];
        },
        error: (err) => console.error('Error loading countries:', err)
      });
  }

updateDisplayDate() {
  if (this.selectedMonth === null || this.selectedDay === null) {
    this.displayDate = '';
    return;
  }
  const monthName = this.months[this.selectedMonth];
  this.displayDate = `${monthName}-${this.selectedDay}`;
}


 

onMonthChange() {
  this.updateDays();

  const maxDays = this.days[this.days.length - 1];
if (this.selectedDay !== null && this.selectedDay > maxDays) {
  this.selectedDay = maxDays;
}

}
updateDays() {
  if (this.selectedMonth === null || this.selectedMonth === undefined) {
    this.days = [];
    return;
  }

  const month = this.selectedMonth;
  const year = this.selectedYear;

  let daysInMonth = 31;

  if ([3, 5, 8, 10].includes(month)) {
    daysInMonth = 30;
  } else if (month === 1) {
    daysInMonth = this.isLeapYear(year) ? 29 : 28;
  }

  this.days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  if (this.selectedDay !== null && this.selectedDay > daysInMonth) {
    this.selectedDay = daysInMonth;
  }
}


isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}
onMonthOrDayChange() {
  if (this.selectedMonth !== null && this.selectedDay !== null) {
    this.confirmSelection();
  }
}

confirmSelection() {
  if (this.selectedMonth !== null && this.selectedDay !== null) {
    this.displayDate = this.formatDate(this.selectedMonth, this.selectedDay);

    const year = this.selectedYear; 
    const selectedDate = new Date(year, this.selectedMonth, this.selectedDay);
    this.addEditForm.patchValue({ calendar_day: selectedDate });
  } else {
    this.displayDate = '';
    this.addEditForm.patchValue({ calendar_day: null });
  }
  this.showMonthDayPicker = false;
}


formatDate(month: number, day: number): string {
  if (month < 0 || month >= 12) return '';
  return `${this.months[month]}-${day}`;
}



toggleMonthDayPicker() {
  this.showMonthDayPicker = !this.showMonthDayPicker;
  this.updateDays();
} 
  loadQueries(callback?: () => void): void {
    this.EventService.getActiveQuery()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.queryList = res;
          this.filteredQueryList = [...this.queryList];
          if (callback) callback();
        },
        error: err => console.error('Error loading queries', err)
      });
  }
onFileChanged(event: any, type: 'event' | 'banner'): void {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    Swal.fire({
      icon: 'error',
      title: 'File too large',
      text: 'Please upload an image smaller than 5MB.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
    return;
  }

  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid file type',
      text: 'Only image files (JPG, PNG, GIF) are allowed.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
    event.target.value = '';
    return;
  }

  if (type === 'event') {
    this.selectedEventFile = file;
  } else {
    this.selectedBannerFile = file;
  }

  const reader = new FileReader();
  reader.onload = () => {
    if (type === 'event') {
      this.imageBase64 = reader.result as string;
    } else {
      this.bannerImageBase64 = reader.result as string;
    }
  };
  reader.readAsDataURL(file);
}


  // parametersNotEmptyValidator(): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const formArray = control as FormArray;
  //     return formArray && formArray.length > 0 ? null : { emptyParameters: true };
  //   };
  // }

  atLeastOneSelected(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value && value.length > 0 ? null : { required: true };
    };
  }

  // bracketValidator(control: any): ValidationErrors | null {
  //   const value = control.value;
  //   if (!value) return null;

  //   const allowed = ['(', ')'];
  //   if (!allowed.includes(value)) {
  //     return { invalidBracket: true };
  //   }
  //   return null;
  // }

  toggleMode(mode: string, isChecked: boolean): void {
    const control = this.addEditForm.get('mode_of_message');
    const currentModes = control?.value || [];

    if (isChecked && !currentModes.includes(mode)) {
      currentModes.push(mode);
    } else if (!isChecked) {
      const index = currentModes.indexOf(mode);
      if (index !== -1) currentModes.splice(index, 1);
    }

    control?.setValue(currentModes);
    control?.markAsTouched();
    control?.updateValueAndValidity();
  }

  // addCondition(): void {
  //   const selectedQueryId = this.editForm.get('query_id')?.value;

  //   if (!selectedQueryId) {
  //     Swal.fire({
  //       toast: true,
  //       position: 'top-end',
  //       showConfirmButton: false,
  //       timer: 3000,
  //       title: 'Please select a query before adding a field.',
  //       icon: 'error'
  //     });
  //     return;
  //   }

  //   // const conditionGroup = this.fb.group({
  //   //   opening_bracket: ['', [this.bracketValidator]],
  //   //   parameter_text: ['', Validators.required],
  //   //   parameter_value: ['', Validators.required],
  //   //   table_name: [''],
  //   //   field_name: [''],
  //   //   parameter_condition: ['', Validators.required],
  //   //   closing_bracket: ['', [this.bracketValidator]],
  //   //   parameter_conjunction: ['', Validators.required]
  //   // });

  //   this.subscribeToConditionChanges(conditionGroup);
  //   this.parameters.push(conditionGroup);
    
  //   this.filteredFieldList.push([...(this.mainFieldList || [])]);
  //   this.filteredValueList.push([]);
  //   this.parameterValueList.push([]);
  //   this.valueSearch.push('');
  //   this.manualValueAllowed.push(false);
  //   this.fieldSearch.push('');

  //   setTimeout(() => {
  //     const container = document.querySelector('.condition-table-wrapper');
  //     if (container) {
  //       container.scrollTop = container.scrollHeight;
  //     }
  //     this.updateQueryPreview();
  //   }, 0);
  // }

  // removeCondition(index: number): void {
  //   this.parameters.removeAt(index);

  //   this.filteredFieldList.splice(index, 1);
  //   this.filteredValueList.splice(index, 1);
  //   this.parameterValueList.splice(index, 1);
  //   this.valueSearch.splice(index, 1);
  //   this.manualValueAllowed.splice(index, 1);
  //   this.fieldSearch.splice(index, 1);
    
  //   setTimeout(() => this.updateQueryPreview(), 0);
  // }

  // subscribeToConditionChanges(conditionGroup: FormGroup): void {
  //   conditionGroup.get('parameter_text')?.valueChanges
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((selectedFieldName) => {
  //       const selectedParam = this.parameterList.find(
  //         (param) => param.field_name === selectedFieldName
  //       );
  //       if (selectedParam) {
  //         conditionGroup.patchValue({
  //           table_name: selectedParam.table_name,
  //           field_name: selectedParam.field_name
  //         }, { emitEvent: false });
  //       }
  //       this.updateQueryPreview();
  //     });

  //   ['opening_bracket', 'parameter_condition', 'parameter_value', 'closing_bracket', 'parameter_conjunction']
  //     .forEach(controlName => {
  //       conditionGroup.get(controlName)?.valueChanges
  //         .pipe(takeUntil(this.destroy$))
  //         .subscribe(() => {
  //           setTimeout(() => this.updateQueryPreview(), 0);
  //         });
  //     });
  // }

  // clearParameters(): void {

  //   this.parameters.clear();
  //   this.filteredFieldList = [];
  //   this.filteredValueList = [];
  //   this.parameterValueList = [];
  //   this.valueSearch = [];
  //   this.manualValueAllowed = [];
  //   this.fieldSearch = [];
  //   this.selectedQueryText = this.baseQueryText || '';
  // }
  filterEvents(): void {
    const search = this.eventSearch.toLowerCase();
    this.filteredList = this.EventList.filter(item =>
      item.event_type.toLowerCase().includes(search)
    );
  }
  
  // onQuerySelected(queryId: number): void {
  //   if (!queryId) return;
   
  //   this.EventService.getActiveEventQueryPreview(queryId)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (res: any) => {
  //         if (!res.data || res.data.length === 0) {
  //           this.selectedQueryText = '';
  //           this.selectedQueryTableName = '';
  //           return;
  //         }

  //         const previewObj = res.data[0];
  //         this.baseQueryText = previewObj.query_text || '';
  //         this.selectedQueryTableName = previewObj.table_name || '';
  //         this.selectedQueryText = this.baseQueryText;

  //         if (this.baseQueryText && !this.baseQueryText.toUpperCase().includes('WHERE')) {
  //           this.baseQueryText += ' WHERE ';
  //         } else if (this.baseQueryText && !this.baseQueryText.trim().endsWith('WHERE')) {
  //           this.baseQueryText += ' ';
  //         }

  //        // setTimeout(() => 
  //           //this.updateQueryPreview(), 0);
  //       },
  //       error: (err) => {
  //         console.error('Error fetching query preview', err);
  //         this.selectedQueryText = 'Error fetching query preview';
  //         this.selectedQueryTableName = '';
  //       }
  //     });

  //   this.EventService.getActiveEventfieldname(queryId)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (res: any) => {
  //         const fields = Array.isArray(res) ? res : [res];
  //         this.mainFieldList = fields || [];

  //         // this.parameters.controls.forEach((_, i) => {
  //         //   if (!this.filteredFieldList[i] || this.filteredFieldList[i].length === 0) {
  //         //     this.filteredFieldList[i] = [...fields];
  //         //   }
  //         // });
  //       },
  //       error: (err) => console.error('Error loading fields:', err)
  //     });
  // }

  // updateQueryPreview(): void {
  //   if (!this.baseQueryText) {
  //     return;
  //   }

  //   const parametersArray = this.parameters.value || [];
  //   let query = this.baseQueryText.trim();

  //   if (!query.toUpperCase().includes('WHERE')) {
  //     query += ' WHERE ';
  //   } else if (!query.toUpperCase().endsWith('WHERE')) {
  //     const whereIndex = query.toUpperCase().lastIndexOf('WHERE');
  //     query = query.substring(0, whereIndex + 5).trim() + ' ';
  //   }

  //   const conditions: string[] = [];

  //   parametersArray.forEach((param: any, index: number) => {
  //     const open = param.opening_bracket || '';
  //     const field = param.parameter_text;
  //     const cond = param.parameter_condition;
  //     const value = param.parameter_value;
  //     const close = param.closing_bracket || '';
  //     let conj = (param.parameter_conjunction || '').toUpperCase();

  //     if (!field || !cond || !value) {
  //       return;
  //     }

  //     let condSymbol = cond;
  //     switch (cond) {
  //       case 'Equal to': condSymbol = '='; break;
  //       case 'Not Equal to': condSymbol = '!='; break;
  //       case 'Greater than': condSymbol = '>'; break;
  //       case 'Less than': condSymbol = '<'; break;
  //       case 'Greater than or Equal to': condSymbol = '>='; break;
  //       case 'Less than or Equal to': condSymbol = '<='; break;
  //       case 'LIKE': condSymbol = 'LIKE'; break;
  //     }

  //     let valStr = `'${value}'`;
  //     if (cond.toUpperCase() === 'LIKE') {
  //       valStr = `'%${value}%'`;
  //     }

  //     let conditionStr = `${open}${field} ${condSymbol} ${valStr}${close}`;

  //     if (conj && conj !== 'ONLY' && index < parametersArray.length - 1) {
  //       conditionStr += ` ${conj}`;
  //     }

  //     conditions.push(conditionStr);
  //   });

  //   if (conditions.length > 0) {
  //     this.selectedQueryText = query + ' ' + conditions.join(' ');
  //   } else {
  //     this.selectedQueryText = this.baseQueryText;
  //   }
  // }



  // filterQueries(): void {
  //   const search = this.querySearch.toLowerCase();
  //   this.filteredQueryList = this.queryList.filter(item =>
  //     item.query_name.toLowerCase().includes(search)
  //   );
  // }

  // filterFieldList(index: number): void {
  //   const searchValue = (this.fieldSearch[index] || '').toLowerCase();

  //   if (!this.filteredFieldList[index]) {
  //     this.filteredFieldList[index] = [];
  //   }

  //   this.filteredFieldList[index] = [];
    
  //   if (this.parameterList && this.parameterList.length > 0) {
  //     this.parameterList.forEach(item => {
  //       if (item.field_name && item.field_name.toLowerCase().includes(searchValue)) {
  //         this.filteredFieldList[index].push(item);
  //       }
  //     });
  //   }
  // }

  // filterValueList(index: number): void {
  //   const searchValue = (this.valueSearch[index] || '').toLowerCase();
  //   const allValues = this.parameterValueList[index] || [];

  //   this.filteredValueList[index] = allValues.filter(val =>
  //     val.sDefaultValue.toLowerCase().includes(searchValue)
  //   );
  // }

  // onQueryDropdownOpened(opened: boolean): void {
  //   if (!opened) {
  //     this.querySearch = '';
  //     this.filteredQueryList = [...this.queryList];
  //   }
  // }

  // onFieldDropdownOpened(index: number, isOpen: boolean): void {
  //   if (!isOpen) return;

  //   this.filteredFieldList[index] = [...(this.parameterList || [])];
  //   this.fieldSearch[index] = '';
  // }

  // onFieldNameChanged(index: number): void {
  //   const conditionGroup = this.parameters.controls[index];
  //   const fieldName = conditionGroup.get('parameter_text')?.value;

  //   if (!fieldName || !this.selectedQueryTableName) return;

  //   conditionGroup.patchValue({
  //     parameter_value: '',
  //     table_name: this.selectedQueryTableName
  //   });

  //   this.filteredValueList[index] = [];
  //   this.parameterValueList[index] = [];
  //   this.manualValueAllowed[index] = false;
  //   this.valueSearch[index] = '';

  //   this.EventService.getEventsFieldValues(this.selectedQueryTableName, fieldName).subscribe({
  //     next: (res: any) => {
  //       const raw = res?.records?.[0]?.sDefaultValue || '';
  //       const rawValues = raw ? raw.split(',').map(v => v.trim()) : [];
  //       const values = rawValues.filter((_, i) => i % 2 === 1);
  //       const valueObjects = values.map(v => ({ sDefaultValue: v }));

  //       this.filteredValueList[index] = [...valueObjects];
  //       this.parameterValueList[index] = [...valueObjects];
  //       this.manualValueAllowed[index] = valueObjects.length === 0;
  //     },
  //     error: (err) => {
  //       console.error('Error fetching field values:', err);
  //       this.manualValueAllowed[index] = true;
  //     }
  //   });
  // }

// openCreateQueryDialog(): void {
//   const eventPlannerId = this.EventService.getPlannerId();
//   this.router.navigate(['/create_event_query'], {
//     state: { 
//       returnTo: '/edit_event_planner/', 
//       formData: this.editForm.value 
//     }
//   });
// }




onQueryChange(query: string) {
  const result = this.validateQueryPreview(query);
  this.missingPlaceholders = result.missing;
}
validateQueryPreview(query: string) {
  if (!query || !query.trim()) {
    return { valid: false, missing: this.mandatoryFields };
  }

  const missing = this.mandatoryFields.filter(field => !query.includes(field));

  return { valid: missing.length === 0, missing };
}




executeQuery() {
  this.isShowErrors = false;
  const queryText = this.addEditForm.value.query_text;
  if (!queryText) {
    this.isShowErrors = true;
    return;
  }
 this.isLoading = true;
  this.EventService.validateQueryPreview(queryText).subscribe({
    next: (res: any) => {
        this.isLoading = false; 
      const count = res?.Data?.count || 0;
      this.queryCount = count; 
      this.queryValid = count > 0;

      if (!this.queryValid) {
        Swal.fire({
          icon: 'error',
          title: 'No Data Found',
          text: `Query returned no data.`,
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Query Executed',
          text: `Query returned ${count} record(s).`,
          confirmButtonText: 'OK'
        });
      }
    },
    error: (err) => {
      
      this.isLoading = false;
      console.error('Query validation error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Query Validation Failed',
        text: 'Unable to execute query. Please check your query syntax.',
        confirmButtonText: 'OK'
      });
    }
  });
}

submitForm(): void {
  this.isLoading = true;
   this.cd.detectChanges();

  if (this.addEditForm.invalid) {
    this.isLoading = false;
    this.addEditForm.markAllAsTouched();
    return;
  }

  const startDate = new Date(this.addEditForm.value.event_start_date);
  const endDate = new Date(this.addEditForm.value.event_end_date);
  const expiryValue = Number(this.addEditForm.value.event_planner_expiry_days);
  const diffTime = endDate.getTime() - startDate.getTime();
  const maxExpiryDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (expiryValue < 1 || expiryValue > maxExpiryDays) {
    this.isLoading = false;
    Swal.fire({ icon: 'error', title: 'Invalid Expiry Days', text: `Expiry must be between 1 and ${maxExpiryDays} days.`, confirmButtonText: 'OK' });
    return;
  }

  if (this.addEditForm.value.schedule_id === '1' && !this.addEditForm.value.iseventyearly) {
    this.isLoading = false;
    Swal.fire({ icon: 'error', title: 'Yearly Frequency Required', text: 'Please select yearly frequency for a periodic schedule.', confirmButtonText: 'OK' });
    return;
  }

  if (!this.selectedEventFile) {
    this.isLoading = false;
    Swal.fire({ icon: 'error', title: 'Image Required', text: 'Please upload an event image.', confirmButtonText: 'OK' });
    return;
  }

  if (!this.selectedBannerFile) {
    this.isLoading = false;
    Swal.fire({ icon: 'error', title: 'Image Required', text: 'Please upload a banner image.', confirmButtonText: 'OK' });
    return;
  }

  const obj = this.currentUser ? JSON.parse(this.currentUser) : '';
  const userid = obj[0]?.login_id;
  const queryText = this.addEditForm.value.query_text?.trim() || '';

  const forbiddenPattern = /\b(DELETE|UPDATE|INSERT|DROP|ALTER|TRUNCATE|CREATE|EXEC|MERGE)\b/i;
  if (forbiddenPattern.test(queryText)) {
    this.isLoading = false;
    Swal.fire({ icon: 'error', title: 'Restricted SQL Command', text: 'Query contains restricted SQL commands.', confirmButtonText: 'OK' });
    return;
  }

  const formData = new FormData();
  formData.append('event_planner_title', this.addEditForm.value.event_planner_title);
  formData.append('schedule_id', this.addEditForm.value.schedule_id);
  formData.append('schedule_type', this.addEditForm.value.schedule_type);
  formData.append('event_planner_status', this.addEditForm.value.event_planner_status);
  formData.append('event_id', this.addEditForm.value.event_id);
  formData.append('template_id', this.addEditForm.value.template_id);
  formData.append('event_planner_expiry_days', this.addEditForm.value.event_planner_expiry_days);
  formData.append('calendar_day', this.addEditForm.value.calendar_day.toISOString());
  formData.append('event_start_date', this.addEditForm.value.event_start_date || '');
  formData.append('event_end_date', this.addEditForm.value.event_end_date || '');
  formData.append('iseventyearly', this.addEditForm.value.iseventyearly || '');
  formData.append('mode_of_message', JSON.stringify(this.addEditForm.value.mode_of_message));
  formData.append('event_planner_image', this.selectedEventFile!);
  formData.append('banner_image', this.selectedBannerFile!);
  formData.append('query_preview', queryText);
  formData.append('userid', userid);

  this.EventService.validateQueryPreview(queryText).subscribe({
    next: (res: any) => {
      const count = res?.Data?.count || 0;
      const missingFields = res?.Data?.missingFields || [];
      const duplicates = res?.Data?.duplicates || [];

      if (duplicates.length > 0) {
        this.isLoading = false;
        Swal.fire({ icon: 'error', title: 'Duplicate Placeholders', text: 'Query contains duplicate placeholders: ' + duplicates.join(', '), confirmButtonText: 'OK' });
        return;
      }

      if (missingFields.length > 0) {
        this.isLoading = false;
        Swal.fire({ icon: 'error', title: 'Missing Placeholders', html: `<p>Missing placeholders: ${missingFields.join(', ')}</p>`, confirmButtonText: 'OK' });
        return;
      }

      if (count === 0) {
        this.isLoading = false;
        Swal.fire({ icon: 'error', title: 'No Data Found', text: 'Query returned no data.', confirmButtonText: 'OK' });
        return;
      }

      // Create Event Planner
      this.EventService.createEventPlanner(formData).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (!res.success) {
            Swal.fire({ icon: 'error', title: 'Failed to Create Event Planner', text: res.message || 'Unknown error occurred.', confirmButtonText: 'OK' });
            return;
          }

          // Event Planner created successfully → check calendar_day condition
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const calendarDay = new Date(this.addEditForm.value.calendar_day);
          const fixedYear = 2000;
          const calDayFixed = new Date(fixedYear, calendarDay.getMonth(), calendarDay.getDate());
          const todayFixed = new Date(fixedYear, today.getMonth(), today.getDate());
          const dayDiff = Math.floor((calDayFixed.getTime() - todayFixed.getTime()) / (1000 * 60 * 60 * 24));

          if (dayDiff >= 0 && dayDiff <= 2) {
            // Call savingcustomereventdetails API
            this.EventService.savingcustomereventdetails().subscribe({
              next: (result) => {
                Swal.fire({ icon: 'success', title: 'Event Planner Created', text: 'Event Planner created and customer details saved successfully!', confirmButtonText: 'OK' })
                  .then(() => this.router.navigate(['/event_planner']));
              },
              error: (err) => {
                Swal.fire({ icon: 'error', title: 'Save Customer Details Failed', text: err?.error?.message || 'Unable to save customer details.', confirmButtonText: 'OK' });
              }
            });
          } else {
            // Just show success for event planner creation
            Swal.fire({ icon: 'success', title: 'Event Planner Created', text: 'Event Planner created successfully.', confirmButtonText: 'OK' })
              .then(() => this.router.navigate(['/event_planner']));
          }
        },
        error: (err) => {
          this.isLoading = false;
          Swal.fire({ icon: 'error', title: 'Create Event Planner Failed', text: err?.error?.message || 'An error occurred.', confirmButtonText: 'OK' });
        }
      });
    },
    error: (err) => {
      this.isLoading = false;
      Swal.fire({ icon: 'error', title: 'Query Validation Error', text: err?.error?.message || 'Unable to validate query.', confirmButtonText: 'OK' });
    }
  });
}










// openEditTemplateDialog(template: any) {
//   const templateName = template?.template_name;
//   if (!templateName) {
//     Swal.fire('Error', 'Template name is missing', 'error');
//     return;
//   }

//   this.EventService.getEventsTemplateByName(templateName).subscribe({
//     next: (templates) => {
//       if (templates && templates.length > 0) {
//         const templateData = templates[0];
//         const dialogRef = this.dialog.open(EditEventTemplateFormComponent, {
//           width: '700px',
//           data: { template: templateData }
//         });

//         dialogRef.afterClosed().subscribe((updatedTemplate) => {
//           if (updatedTemplate) {
//             this.selectedTemplate = updatedTemplate;
//             this.getEventTemplateList(); 
//           }
//         });
//       } else {
//         Swal.fire('Not Found', `No template found with name: ${templateName}`, 'warning');
//       }
//     },
//     error: (err) => {
//       console.error(err);
//       Swal.fire('Error', 'Failed to load template', 'error');
//     }
//   });
// }
openEditTemplateDialog(template: any) {
  const dialogRef = this.dialog.open(EditEventTemplateFormComponent, {
    width: '700px',
    data: { template }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.onTemplateChangeById(template.template_id);
    }
  });
}



  getEventTemplateList() {
    this.EventService.getActiveTemplate().pipe()
      .subscribe((data: any) => {
        console.log("geteventList ", data);
        this.List = data;
        console.log("data",data)
        this.loadRecord();
      });
  }
    loadRecord() {
        throw new Error('Method not implemented.');
    }
// proceedSaveEventPlanner(formData: FormData) {
//   this.isLoading = true;
//   this.EventService.(formData).subscribe({
//     next: (res: any) => {
//       this.isLoading = false;

//       if (res && res.success) {
//         Swal.fire({
//           icon: 'success',
//           title: 'Event Planner Saved',
//           text: 'The event planner has been successfully saved.',
//           confirmButtonText: 'OK'
//         });
//         this.addEditForm.reset();
//         this.selectedFile = null;
//         this.plannerDetailsExpanded = false;
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'Save Failed',
//           text: res.message || 'Unable to save event planner.',
//           confirmButtonText: 'OK'
//         });
//       }
//     },
//     error: (err) => {
//       this.isLoading = false;
//       Swal.fire({
//         icon: 'error',
//         title: 'Save Failed',
//         text: 'Something went wrong while saving.',
//         confirmButtonText: 'OK'
//       });
//       console.error(err);
//     }
//   });
// }




        
  
removeImage(type: 'event' | 'banner') {
  if (type === 'event') {
    this.imageBase64 = null;
  } else {
    this.bannerImageBase64 = null;
  }
}

  cancel(): void {
    this.router.navigate(['/event_planner']);
  }
}