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
  selector: 'app-edit-event-planner-form',
  templateUrl: './edit-event-planner-form.component.html',
  styleUrls: ['./edit-event-planner-form.component.css']
})
export class EditEventPlannerFormComponent implements OnInit, OnDestroy {
  @Input() event_planner_id!: number;
  @Input() event_id!: any;
  @Input() template_id!: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  plannerDetailsExpanded: boolean = true;  
  filterDetailsExpanded: boolean = true;
  isShowErrors: boolean = false;   
  isEditMode: boolean = false;
  isInitializingForm = false;
isClearingDates = false;
isPageLoading: boolean = true;

  apiKey: string = 'a4db08b7-5729-4ba9-8c08-f2df493465a1';
  today: Date = new Date();
  minEndDate: Date | null = null;
  
  filteredTemplateList: any[] = [];



  public matcher = new ErrorMatcherService();
  errors = errorMessages;

  public editForm!: FormGroup;
  
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


existingBannerImageUrl: string | null = '...';

existingImageUrl:string | null = '...';

  // Filter related
  fieldSearch: string[] = [];
  filteredFieldList: any[][] = [];
  queryList: any[] = [];
  
  selectedTemplate: any = null;
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
   missingPlaceholders: string[] = [];
  
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

  // Condition/Conjunction Lists
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
  isLoadingData: boolean = true;
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
showMonthDayPicker = false;
isCalendarDayInvalid: boolean = false;
calendarErrorText: string = '';
calendarDayControl: any;


selectedYear: number = new Date().getFullYear();
expiryDaysControl = new FormControl('', [Validators.required]);
isExpiryInvalid: boolean = false;
expiryErrorText: string = '';
maxExpiryDays: number = 0;


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
  this.isPageLoading = true;
  this.isInitializingForm = true;

  
  
  const today = new Date();
  this.today.setHours(0, 0, 0, 0);
    
    this.initializeForm();
    
    
   const calendarDay = new Date(this.editForm.value.calendar_day);
const day = String(calendarDay.getDate()).padStart(2, '0');
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const month = monthNames[calendarDay.getMonth()];
this.displayDate = `${month}-${day}`; 
  if (this.selectedMonth === null) this.selectedMonth = today.getMonth();
  if (this.selectedDay === null) this.selectedDay = today.getDate();

  this.updateDays();         
  this.updateDisplayDate();  
  this.editForm.get('calendar_day')?.valueChanges.subscribe(value => {
     if (this.isClearingDates || this.isInitializingForm) return;
  this.validateCalendarDay(value);

});
  this.editForm.get('event_start_date')?.valueChanges.subscribe((value) => {
     if (this.isClearingDates || this.isInitializingForm) return;
    this.validateCalendarDay(value);
    
  });
  this.editForm.get('event_end_date')?.valueChanges.subscribe((value) => {
     if (this.isClearingDates || this.isInitializingForm) return;
    this.validateCalendarDay(value);
   
  });
 this.editForm.get('calendar_day')?.valueChanges.subscribe(() => this.validateExpiryDays());
  this.editForm.get('event_end_date')?.valueChanges.subscribe(() => this.validateExpiryDays());
  this.editForm.get('event_planner_expiry_days')?.valueChanges.subscribe(() => this.validateExpiryDays());
  this.expiryDaysControl.valueChanges.subscribe(() => {
  this.validateExpiryDays();
});

 

  
  this.loadInitialData();
  this.setupFormSubscriptions();
  this.loadQueries();

  this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');

  const routeId = Number(this.route.snapshot.paramMap.get('eventPlannerId'));
  this.eventPlannerId = routeId || this.EventService.getPlannerId();
  this.editForm.get('schedule_id')?.valueChanges.subscribe(value => {
  if (value === '1') {
    this.editForm.get('iseventyearly')?.setValue(true);
  }
}); 

  if (this.eventPlannerId) {
    this.isEditMode = true;
    this.loadEventPlannerData(this.eventPlannerId);
  } else {
    this.isEditMode = false;
    this.isLoadingData = false; 
  }
  
  this.isInitializingForm = false;
}







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


  get parameters(): FormArray {
    return this.editForm.get('parameters') as FormArray;
  }
onTemplateDropdownOpened(opened: boolean) {
  if (!opened) {
    this.templateSearch = '';
    this.filteredTemplateList = [...this.TemplateList];
  } else {
    const templateId = this.editForm.value.template_id;
    if (templateId) {
      this.onTemplateChangeById(templateId);
    }
  }
}
onTemplateSelect(templateId: any) {
  if (!templateId) {
    this.selectedTemplate = null;
    return;
  }

  this.onTemplateChangeById(templateId);
}
isYearlyChecked(): boolean {
  return this.editForm.get('iseventyearly')?.value;
}

validateExpiryDays() {
  const ctrl = this.editForm.get('event_planner_expiry_days');
  if (!ctrl) return; 
  const startDate = new Date(this.editForm.value.event_start_date);
  const endDate = new Date(this.editForm.value.event_end_date);

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
  const ctrl = this.editForm.get('calendar_day'); 
  const startDate = new Date(this.editForm.value.event_start_date);
  const endDate = new Date(this.editForm.value.event_end_date);
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

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  if (invalid) {
    this.isCalendarDayInvalid = true;
    this.calendarErrorText = `Calendar day must be after ${String(startDate.getDate()).padStart(2,'0')}-${monthNames[startDate.getMonth()]} and on or before ${String(endDate.getDate()).padStart(2,'0')}-${monthNames[endDate.getMonth()]}.`;

    ctrl?.setErrors({ invalidCalendarDay: true });
  } else {
    this.isCalendarDayInvalid = false;
    this.calendarErrorText = '';
    ctrl?.setErrors(null);
  }
}

isYearlyReadOnly(): boolean {
  const scheduleId = this.editForm.get('schedule_id')?.value;
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
        
  this.onTemplateChangeById(this.template_id);
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
      this.editForm.controls['template_id'].setValue(result.newTemplateId);
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
    
    this.editForm = this.fb.group({
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
      calendar_day: [new Date(), Validators.required],
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
        this.editForm.patchValue({ template_id: this.template_id });
        
  this.onTemplateChangeById(this.template_id);
      }
    }
  }
 private setupFormSubscriptions(): void {
  this.editForm.get('schedule_id')?.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe((value) => {
      const scheduleType = value === '1' ? 'Periodic' : 'Manual';
      this.editForm.get('schedule_type')?.setValue(scheduleType, { emitEvent: false });

      const yearlyControl = this.editForm.get('iseventyearly');
      if (value === '1') {  
        yearlyControl?.setValidators([Validators.required]);
        yearlyControl?.setValue(true);
      } else {  
        yearlyControl?.clearValidators();
      }
      yearlyControl?.updateValueAndValidity();
    });

  this.editForm.get('event_start_date')?.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe((startDate) => {
      this.minEndDate = startDate ? new Date(startDate) : new Date();
      this.editForm.controls['event_end_date'].updateValueAndValidity();
    });
}

  private handleRouteParams(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = Number(params.get('eventPlannerId'));
        if (id) {
          this.event_planner_id = id;
          this.loadEventPlannerData(id);
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
      this.editForm.get('event_id')?.setValue(newEvent.event_id);

      this.selectedEventName = newEvent.event_type;

      this.cd.detectChanges();
    }
  });
}

loadEventPlannerData(eventPlannerId: number): void {
  this.isLoadingData = true;

  this.EventService.getEventPlannerFiltersById(eventPlannerId)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response: any) => {
        const plannerData = response?.data || response;
        
        
        if (!plannerData) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Event Planner not found',
            confirmButtonText: 'OK'
          }).then(() => this.router.navigate(['/event_planner']));
          return;
        }

        this.existingImageUrl = plannerData.event_planner_image || '';

        
        this.existingBannerImageUrl = plannerData.banner_image || '';
        console.log("existingImageUrl =>", this.existingImageUrl);
console.log("existingBannerImageUrl =>", this.existingBannerImageUrl);

     
        // Parse mode_of_message
        let modeOfMessage = plannerData.mode_of_message || ['Push'];
        if (typeof modeOfMessage === 'string') {
          try {
            modeOfMessage = JSON.parse(modeOfMessage);
          } catch (e) {
            modeOfMessage = ['Push'];
          }
        }

        let scheduleId = '1';
        if (plannerData.schedule_type) {
          scheduleId = plannerData.schedule_type === 'Periodic' ? '1' : '0';
        } else if (plannerData.schedule_id) {
          scheduleId = plannerData.schedule_id.toString();
        }

        const startDate = plannerData.event_start_date ? new Date(plannerData.event_start_date) : null;
        const endDate = plannerData.event_end_date ? new Date(plannerData.event_end_date) : null;
        const calendarDay = plannerData.calendar_day ? new Date(plannerData.calendar_day) : null;

        let isYearly = plannerData.iseventyearly;
        if (typeof isYearly === 'string') {
          isYearly = isYearly === 'true' || isYearly === '1';
        }

        this.editForm.patchValue({
          event_planner_id: plannerData.event_planner_id,
          event_planner_title: plannerData.event_planner_title,
          schedule_id: scheduleId,
          schedule_type: plannerData.schedule_type || 'Periodic',
          event_planner_status: plannerData.event_planner_status?.toString() || '1',
          event_id: plannerData.event_id,
          template_id: plannerData.template_id,
          event_planner_expiry_days: plannerData.event_planner_expiry_days,
          event_start_date: startDate,  
          event_end_date: endDate,      
          iseventyearly: isYearly,      
          calendar_day: calendarDay,
          mode_of_message: modeOfMessage,
          query_text: plannerData.query_preview || plannerData.query_text || '',  
        
          status: plannerData.status?.toString() || '1'
        });
        this.template_id = plannerData.template_id;

this.onTemplateChangeById(this.template_id);
        // Update calendar display
        if (calendarDay) {
          this.selectedMonth = calendarDay.getMonth();
          this.selectedDay = calendarDay.getDate();
          this.updateDays();
          this.updateDisplayDate();
        }

        this.selectedQueryText = plannerData.query_preview || plannerData.query_text || '';
        this.baseQueryText = this.selectedQueryText;

        this.isLoadingData = false;
      },
      error: (err) => {
        console.error('Error loading event planner:', err);
        this.isLoadingData = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load event planner data',
          confirmButtonText: 'OK'
        });
      }
    });
}



onStartDateChange(event: any) {
  const startDate = event.value;

  if (this.isInitializingForm || this.isLoadingData) return;
  
  this.minEndDate = event.value;
  
  this.isClearingDates = true;
  this.clearExpiryAndCalendar();
  this.isClearingDates = false;

  if (startDate) {
    this.minEndDate = new Date(startDate);
    this.minEndDate.setDate(this.minEndDate.getDate() + 1);

    const endDate = this.editForm.get('event_end_date')?.value;
    if (endDate && endDate <= startDate) {
      this.editForm.get('event_end_date')?.reset();
    }
  }
}

// onEventEndDateChange() {
//   if (this.isInitializingForm || this.isLoadingData) return;
  
//   this.isClearingDates = true; 
//   this.clearExpiryAndCalendar();
//   this.isClearingDates = false;
// }

onEventEndDateChange() {
  if (this.isInitializingForm || this.isLoadingData) return;
  
  this.isClearingDates = true; 
  
  this.clearExpiryAndCalendar();
  
  this.isClearingDates = false;
}

clearExpiryAndCalendar() {
  const expiryControl = this.editForm.get('event_planner_expiry_days');
  const calendarControl = this.editForm.get('calendar_day');

  if (expiryControl) {
    expiryControl.setValue('', { emitEvent: false }); 
    expiryControl.markAsPristine();
    expiryControl.markAsUntouched();
    expiryControl.setErrors(null); 
  }

  if (calendarControl) {
    calendarControl.setValue(null, { emitEvent: false });
    calendarControl.markAsPristine();
    calendarControl.markAsUntouched();
    calendarControl.setErrors(null);
  }
  this.displayDate = '';
  // this.selectedMonth = null;
  // this.selectedDay = null;
  
  this.isCalendarDayInvalid = false;
  this.calendarErrorText = '';
  this.isExpiryInvalid = false;
  this.expiryErrorText = '';
  this.queryCount = null; 
}
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
 endDateValidator(control: AbstractControl) {
    const startDate = this.editForm?.controls['event_start_date'].value;
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
    this.editForm.patchValue({
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
 
 
         if (this.event_id && this.editForm) {
           const found = this.EventList.find(e => e.event_id == this.event_id);
           if (found) {
             this.editForm.patchValue({ event_id: found.event_id });
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
    this.editForm.patchValue({ calendar_day: selectedDate });
  } else {
    this.displayDate = '';
    this.editForm.patchValue({ calendar_day: null });
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

  onFileChanged(event: any,type: 'event' | 'banner'): void {
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


    const reader = new FileReader();
    reader.onload = () => {
    if (type === 'event') {
      this.selectedEventFile = file;
      this.imageBase64 = reader.result as string;
      this.existingImageUrl = null; 
    } else {
      this.selectedBannerFile = file;
      this.bannerImageBase64 = reader.result as string;
      this.existingBannerImageUrl = null;
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
    const control = this.editForm.get('mode_of_message');
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
executeQuery() {
  const queryText = this.editForm.value.query_text;
  if (!queryText) {
    this.isShowErrors = true;
    return;
  }

  this.EventService.validateQueryPreview(queryText).subscribe({
    next: (res: any) => {
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


updateForm(): void {
  this.isLoading = true;
  
  const existingImage = this.existingImageUrl;
  const existingBannerImageUrl = this.existingBannerImageUrl;

  if (!this.selectedEventFile && !existingImage) {
    this.isLoading = false;
    Swal.fire({
      icon: 'error',
      title: 'Image Required',
      text: 'Please select an event image before submitting.',
      confirmButtonText: 'OK'
    });
    return;
  }

  if (!this.selectedBannerFile && !existingBannerImageUrl) {
    this.isLoading = false;
    Swal.fire({
      icon: 'error',
      title: 'Image Required',
      text: 'Please select a banner image before submitting.',
      confirmButtonText: 'OK'
    });
    return;
  }

  const startDate = new Date(this.editForm.value.event_start_date);
  const endDate = new Date(this.editForm.value.event_end_date);
  const calendarDay = new Date(this.editForm.value.calendar_day);
  const expiryDays = Number(this.editForm.value.event_planner_expiry_days);

  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();

  const startKey = startDate.getMonth() * 100 + startDate.getDate();
  const endKey = endDate.getMonth() * 100 + endDate.getDate();
  const calKey = calendarDay.getMonth() * 100 + calendarDay.getDate();

  let invalid = false;

  if (startYear === endYear) {
    if (calKey <= startKey || calKey >= endKey) invalid = true;
  } else {
    if (calKey < startKey && calKey > endKey) invalid = true;
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  if (invalid) {
    this.isLoading = false;
    Swal.fire({
      icon: 'error',
      title: 'Invalid Calendar Day',
      text: `Calendar day (dd-MMM) should be valid between ${String(startDate.getDate()).padStart(2,'0')}-${monthNames[startDate.getMonth()]} and ${String(endDate.getDate()).padStart(2,'0')}-${monthNames[endDate.getMonth()]}.`,
      confirmButtonText: 'OK'
    });
    return;
  }

  const queryText = this.editForm.value.query_text || this.selectedQueryText || '';

  this.EventService.validateQueryPreview(queryText).subscribe({
    next: (res: any) => {
      this.isLoading = false;
      const duplicates = res?.Data?.duplicates || [];

      if (duplicates.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Duplicate Placeholders',
          text: 'Query contains duplicate placeholders: ' + duplicates.join(', '),
          confirmButtonText: 'OK'
        });
        return;
      }

      if (res.success === false && res.Data?.missingFields?.length) {
        const missingFields = res.Data.missingFields;
        Swal.fire({
          icon: 'error',
          title: 'Query Missing Mandatory Placeholders',
          html: `
            <p>The following placeholders are missing in your query:</p>
            <p style="text-align: left; margin-left: 20px;">
              ${missingFields.join(', ')}
            </p>
          `,
          confirmButtonText: 'OK'
        });
        return;
      }

      const hasData = res?.Data && res.Data.count > 0;
      if (!hasData) {
        Swal.fire({
          icon: 'error',
          title: 'No Data Found',
          text: 'Query returned no data from CRM.',
          confirmButtonText: 'OK'
        });
        return;
      }

      this.proceedSaveEventPlanner();
    },
    error: (err: any) => {
      this.isLoading = false;
      console.error('Full error object:', err);

      const errorMessage =
        err?.error?.Message || err?.error?.message || 'Failed to validate query.';
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonText: 'OK'
      });
    }
  });
}

proceedSaveEventPlanner(): void {
  this.isLoading = true;

  if (this.editForm.invalid) {
    this.isLoading = false;
    this.editForm.markAllAsTouched();
    return;
  }

  const startDate = new Date(this.editForm.value.event_start_date);
  const endDate = new Date(this.editForm.value.event_end_date);
  const calendarDay = new Date(this.editForm.value.calendar_day);
  const expiryValue = Number(this.editForm.value.event_planner_expiry_days);

  const diffTime = endDate.getTime() - startDate.getTime();
  const maxExpiryDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const scheduleId = this.editForm.value.schedule_id;
  const yearlyValue = this.editForm.value.iseventyearly;
  
  if (scheduleId === '1' && !yearlyValue) {
    this.isLoading = false;
    Swal.fire({
      icon: 'error',
      title: 'Yearly Frequency Required',
      text: 'Please select yearly frequency for a periodic schedule.',
      confirmButtonText: 'OK'
    });
    return;
  }

  const obj = this.currentUser ? JSON.parse(this.currentUser) : '';
  const userid = obj[0]?.login_id;

  const plannerId = this.editForm.value.event_planner_id;
  const queryText = this.editForm.value.query_text?.trim();

  const forbiddenPattern = /\b(DELETE|UPDATE|INSERT|DROP|ALTER|TRUNCATE|CREATE|EXEC|MERGE)\b/i;
  if (forbiddenPattern.test(queryText)) {
    this.isLoading = false;
    Swal.fire({
      icon: 'error',
      title: 'Restricted SQL Command',
      text: 'Query contains restricted SQL commands (DELETE, UPDATE, INSERT, DROP, ALTER, TRUNCATE, CREATE, EXEC).',
      confirmButtonText: 'OK'
    });
    return;
  }

  // Create FormData with all fields
  const updateFormData = new FormData();
  updateFormData.append('event_planner_id', plannerId);
  updateFormData.append('event_planner_title', this.editForm.value.event_planner_title);
  updateFormData.append('schedule_id', this.editForm.value.schedule_id);
  updateFormData.append('schedule_type', this.editForm.value.schedule_type);
  updateFormData.append('event_planner_status', this.editForm.value.event_planner_status);
  updateFormData.append('event_id', this.editForm.value.event_id);
  updateFormData.append('template_id', this.editForm.value.template_id);
  updateFormData.append('event_planner_expiry_days', this.editForm.value.event_planner_expiry_days);
  updateFormData.append('calendar_day', this.editForm.value.calendar_day.toISOString());
  updateFormData.append('event_start_date', this.editForm.value.event_start_date || '');
  updateFormData.append('event_end_date', this.editForm.value.event_end_date || '');
  updateFormData.append('iseventyearly', this.editForm.value.iseventyearly || '');
  updateFormData.append('mode_of_message', JSON.stringify(this.editForm.value.mode_of_message));
  updateFormData.append('query_preview', queryText || '');
  updateFormData.append('userid', userid);

  // Handle image files
  if (this.selectedEventFile) {
    updateFormData.append('event_planner_image', this.selectedEventFile);
  } else if (this.existingImageUrl) {
    updateFormData.append('existing_event_image', this.existingImageUrl);
  }

  if (this.selectedBannerFile) {
    updateFormData.append('banner_image', this.selectedBannerFile);
  } else if (this.existingBannerImageUrl) {
    updateFormData.append('existing_banner_image', this.existingBannerImageUrl);
  }

  // Make API call
  this.EventService.updateEventPlanner(plannerId, updateFormData)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log("Update Response:", response);

        if (response.success || response.data?.success) {
          console.log("response.success:", response.success);
          console.log("response started", response);
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const calendarDay = new Date(this.editForm.value.calendar_day);

          const fixedYear = 2000;
          const calDayFixed = new Date(fixedYear, calendarDay.getMonth(), calendarDay.getDate());
          const todayFixed = new Date(fixedYear, today.getMonth(), today.getDate());

          const dayDiff = Math.floor((calDayFixed.getTime() - todayFixed.getTime()) / (1000 * 60 * 60 * 24));

          console.log("calendarDay", calendarDay);
          console.log("dayDiff", dayDiff);

          if (dayDiff >= 0 && dayDiff <= 2) {
            console.log("dayDiff", dayDiff);
            this.EventService.savingcustomereventdetails().subscribe({
              next: (result) => {
                console.log("savingcustomer", result);
                if (result.success) {
                  Swal.fire({
                    icon: 'success',
                    title: 'Event Planner Updated',
                    text: 'Customer event details added successfully!'
                  }).then(() => this.router.navigate(['/event_planner']));
                } else {
                  Swal.fire({
                    icon: 'success',
                    title: 'Event Planner Updated',
                    text: 'Event Planner Updated successfully.'
                  }).then(() => this.router.navigate(['/event_planner']));
                }
              },
              error: () => {
                Swal.fire({
                  icon: 'error',
                  title: 'Event Planner Update Error',
                  text: 'Event Planner Updated unsuccessfully.'
                }).then(() => this.router.navigate(['/event_planner']));
              }
            });
          } else {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: response.message || 'Event Planner updated successfully.'
            }).then(() => this.router.navigate(['/event_planner']));
          }

        } else if (response.message === "Event Planner is in Transaction") {
          Swal.fire({ 
            icon: 'warning', 
            title: 'Warning!', 
            text: response.message 
          });
        } else if (response.message === "Event Planner Already Exist") {
          Swal.fire({ 
            icon: 'warning', 
            title: 'Warning!', 
            text: response.message 
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: response.message || 'Failed to update Event Planner.'
          });
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error updating event planner:', err);

        const msg: string = err?.Message || '';
        let missingFields: string[] = [];

        Swal.fire({
          icon: 'error',
          title: 'Query Missing Fields',
          html: missingFields.length
            ? `The following mandatory fields are missing:<br><ul>${missingFields
                .map(f => `<li>${f}</li>`)
                .join('')}</ul>`
            : err?.error?.message || 'Failed to update Event Planner. Missing mandatory fields.',
          confirmButtonText: 'OK'
        });
      }
    });
}

removeImage(type: 'event' | 'banner') {
  if (type === 'event') {
    this.imageBase64 = null;
    this.existingImageUrl = null;
  } else {
    this.bannerImageBase64 = null;
    this.existingBannerImageUrl = null;
  }
}

        
  
// removeImage(): void {
//   this.imageBase64 = null;       
//   this.selectedFile = null;      
//   this.existingImageUrl = null;  
// }

  cancel(): void {
    this.router.navigate(['/event_planner']);
  }
}