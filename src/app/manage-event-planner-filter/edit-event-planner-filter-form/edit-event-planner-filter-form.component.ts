import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CookieService } from 'src/app/service/cookie.service';
import { EventService } from 'src/app/service/event/event.service';
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-edit-event-planner-filter-form',
  templateUrl: './edit-event-planner-filter-form.component.html',
  styleUrls: ['./edit-event-planner-filter-form.component.css']
})
export class EditEventPlannerFormComponent implements OnInit, OnDestroy {
  @Input() action!: any;
  @Input() isShowErrors: boolean = false;
  @Input() event_planner_id!: any;
  @Input() event_id!: any;
  @Input() template_id!: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  plannerDetailsExpanded: boolean = true;  
  filterDetailsExpanded: boolean = true;   

  public matcher = new ErrorMatcherService();
  errors = errorMessages;

  // Form Groups
  public addEditForm!: FormGroup;
  
  // Destroy subject for cleanup
  private destroy$ = new Subject<void>();

  // Dropdown Lists
  EventList: any[] = [];
  TemplateList: any[] = [];
  countryList: any[] = [];

  // File Upload
  selectedFile: File | null = null;
  imageBase64: string | ArrayBuffer | null = null;

  // Filter related
  fieldSearch: string[] = [];
  filteredFieldList: any[][] = [];
  queryList: any[] = [];
  filteredQueryList: any[] = [];
  querySearch: string = '';
  selectedQueryText: string = '';
  baseQueryText: string = '';
  parameterList: any[] = [];

  // Value Lists
  filteredValueList: { sDefaultValue: string }[][] = [];
  parameterValueList: { sDefaultValue: string }[][] = [];
  valueSearch: string[] = [];
  manualValueAllowed: boolean[] = [];

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

  // Table Data
  dataSource = new MatTableDataSource<any>([]);
  currentUser: any;
  mainFieldList: any[] = [];
  selectedQueryTableName!: string;
  userid: any;
  eventService: any;

  constructor(
    private fb: FormBuilder, 
    private EventService: EventService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private cookieService: CookieService,
    
  ) {}

  ngOnInit(): void {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    this.initializeForm();
    this.loadInitialData();
    this.setupFormSubscriptions();
    this.handleRouteParams();
  }
 get parameters(): FormArray {
    return this.addEditForm.get('parameters') as FormArray;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
      event_planner_expiry_days: ['', Validators.required],
      country_name: [''],
      calendar_day: [new Date(),Validators.required],
      event_planner_image: [''],
      mode_of_message: [['Push'], this.atLeastOneSelected()],
      parameters: this.fb.array([], this.parametersNotEmptyValidator()),
      parameter_desc: ['', Validators.required],
      status: ['1'],
      event_planner_id: [''],
      query_id: ['', Validators.required]
    });
  }

  private loadInitialData(): void {
    this.loadTemplates();
    this.loadCountry();
    this.loadQueries();
    this.loadEventPlanners();
    this.loadEvents();
  }
private parseCalendarDay(rawDay: string | null): Date | null {
  if (!rawDay) return null;

  const isoDate = new Date(rawDay);
  if (!isNaN(isoDate.getTime())) return isoDate;

  if (rawDay.length === 6) {
    const [monthStr, dayStr] = rawDay.split('-');
    const year = new Date().getFullYear();
    return new Date(`${monthStr} ${dayStr}, ${year}`);
  }

  return null;
}

  private setupFormSubscriptions(): void {
    // Schedule type auto-update
    this.addEditForm.get('schedule_id')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const scheduleType = value === '1' ? 'Periodic' : 'Manual';
        this.addEditForm.get('schedule_type')?.setValue(scheduleType, { emitEvent: false });
      });

    // Query ID changes
    this.addEditForm.get('query_id')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((queryId) => {
        if (!queryId || queryId === 'new') {
          this.clearParameters();
          return;
        }

        this.EventService.getActiveEventparameternameagainsteventplanner(queryId, this.event_planner_id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (params: any[]) => {
              if (!params || params.length === 0) {
                this.clearParameters();
              } else {
                this.parameterList = params;
                this.populateFiltersFromParameters(params);
              }
              this.onQuerySelected(queryId);
            },
            error: (err) => {
              console.error('Error fetching parameters for query:', err);
              this.clearParameters();
              this.onQuerySelected(queryId);
            }
          });
      });
  }

  private handleRouteParams(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = Number(params.get('eventPlannerId'));
        if (id) {
          this.event_planner_id = id;
          this.addEditForm.patchValue({ event_planner_id: id });
          this.loadEventPlannerTable(id);
        }
      });
  }

 
createParameterGroup(param?: any): FormGroup {
  return this.fb.group({
    parameter_id: [param?.parameter_id || ''],
    parameter_desc: [param?.parameter_desc || '', Validators.required],
    parameter_text: [param?.parameter_text || '', Validators.required],
    parameter_condition: [param?.parameter_condition || '', Validators.required],
    parameter_conjunction: [param?.parameter_conjunction || ''],
    parameter_value: [param?.parameter_value || '', Validators.required],
    opening_bracket: [param?.opening_bracket || ''],
    closing_bracket: [param?.closing_bracket || ''],
    query_name: [param?.query_name || ''],
    table_name: [param?.table_name || ''],
    field_name: [param?.field_name || '']
  });
}

addParameter(param?: any): void {
  this.parameters.push(this.createParameterGroup(param));
}

  loadEvents(): void {
    this.EventService.getActiveEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.EventList = res?.data || res || [];
          this.cd.detectChanges();

          if (this.event_id) {
            this.addEditForm.patchValue({ event_id: this.event_id });
          }
        },
        error: (err) => console.error('Error loading events:', err)
      });
  }

  private patchTemplateValueIfReady(): void {
    if (this.template_id && this.TemplateList.length > 0) {
      const template = this.TemplateList.find(t => t.template_id === this.template_id);
      if (template) {
        this.addEditForm.patchValue({ template_id: this.template_id });
      }
    }
  }

  loadTemplates(): void {
    this.EventService.getActiveTemplate()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.TemplateList = res || [];
          this.patchTemplateValueIfReady();
        },
        error: (err) => console.error('Error loading templates:', err)
      });
  }

  loadCountry(): void {
    this.EventService.getCountry()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.countryList = res?.data || [];
        },
        error: (err) => console.error('Error loading countries:', err)
      });
  }

  loadQueries(): void {
    this.EventService.getActiveQuery()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.queryList = res || [];
          this.filteredQueryList = [...this.queryList];
        },
        error: (error) => console.error('Error loading queries', error)
      });
  }

  loadEventPlanners(): void {
    this.EventService.getActiveEventPlanner()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => this.EventList = res || [],
        error: (error) => console.error('Error loading event planners', error)
      });
  }

  onFileChanged(event: any): void {
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

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imageBase64 = reader.result;
      this.addEditForm.patchValue({
        event_planner_image: this.imageBase64
      });
    };
    reader.readAsDataURL(file);
  }

  parametersNotEmptyValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      return formArray && formArray.length > 0 ? null : { emptyParameters: true };
    };
  }

  atLeastOneSelected(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value && value.length > 0 ? null : { required: true };
    };
  }

  bracketValidator(control: any): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const allowed = ['(', ')'];
    if (!allowed.includes(value)) {
      return { invalidBracket: true };
    }
    return null;
  }

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

  addCondition(): void {
    const selectedQueryId = this.addEditForm.get('query_id')?.value;

    if (!selectedQueryId) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: 'Please select a query before adding a field.',
        icon: 'error'
      });
      return;
    }

    const conditionGroup = this.fb.group({
      opening_bracket: ['', [this.bracketValidator]],
      parameter_text: ['', Validators.required],
      parameter_value: ['', Validators.required],
      table_name: [''],
      field_name: [''],
      parameter_condition: ['', Validators.required],
      closing_bracket: ['', [this.bracketValidator]],
      parameter_conjunction: ['', Validators.required]
    });

    this.subscribeToConditionChanges(conditionGroup);
    this.parameters.push(conditionGroup);
    
    this.filteredFieldList.push([...(this.mainFieldList || [])]);
    this.filteredValueList.push([]);
    this.parameterValueList.push([]);
    this.valueSearch.push('');
    this.manualValueAllowed.push(false);
    this.fieldSearch.push('');

    setTimeout(() => {
      const container = document.querySelector('.condition-table-wrapper');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
      this.updateQueryPreview();
    }, 0);
  }

  removeCondition(index: number): void {
    this.parameters.removeAt(index);

    this.filteredFieldList.splice(index, 1);
    this.filteredValueList.splice(index, 1);
    this.parameterValueList.splice(index, 1);
    this.valueSearch.splice(index, 1);
    this.manualValueAllowed.splice(index, 1);
    this.fieldSearch.splice(index, 1);
    
    setTimeout(() => this.updateQueryPreview(), 0);
  }

  subscribeToConditionChanges(conditionGroup: FormGroup): void {
    conditionGroup.get('parameter_text')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedFieldName) => {
        const selectedParam = this.parameterList.find(
          (param) => param.field_name === selectedFieldName
        );
        if (selectedParam) {
          conditionGroup.patchValue({
            table_name: selectedParam.table_name,
            field_name: selectedParam.field_name
          }, { emitEvent: false });
        }
        this.updateQueryPreview();
      });

    ['opening_bracket', 'parameter_condition', 'parameter_value', 'closing_bracket', 'parameter_conjunction']
      .forEach(controlName => {
        conditionGroup.get(controlName)?.valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            setTimeout(() => this.updateQueryPreview(), 0);
          });
      });
  }

  clearParameters(): void {
    this.parameters.clear();
    this.filteredFieldList = [];
    this.filteredValueList = [];
    this.parameterValueList = [];
    this.valueSearch = [];
    this.manualValueAllowed = [];
    this.fieldSearch = [];
    this.selectedQueryText = this.baseQueryText || '';
  }

  onQuerySelected(queryId: number): void {
    if (!queryId) return;

    // Fetch query preview and table name
    this.EventService.getActiveEventQueryPreview(queryId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (!res.data || res.data.length === 0) {
            this.selectedQueryText = '';
            this.selectedQueryTableName = '';
            return;
          }

          const previewObj = res.data[0];
          this.baseQueryText = previewObj.query_text || '';
          this.selectedQueryTableName = previewObj.table_name || '';
          this.selectedQueryText = this.baseQueryText;

          if (this.baseQueryText && !this.baseQueryText.toUpperCase().includes('WHERE')) {
            this.baseQueryText += ' WHERE ';
          } else if (this.baseQueryText && !this.baseQueryText.trim().endsWith('WHERE')) {
            this.baseQueryText += ' ';
          }

          setTimeout(() => this.updateQueryPreview(), 0);

          console.log('Selected Table Name:', this.selectedQueryTableName);
        },
        error: (err) => {
          console.error('Error fetching query preview', err);
          this.selectedQueryText = 'Error fetching query preview';
          this.selectedQueryTableName = '';
        }
      });

    this.EventService.getActiveEventfieldname(queryId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const fields = Array.isArray(res) ? res : [res];
          this.mainFieldList = fields || [];

          this.parameters.controls.forEach((_, i) => {
            if (!this.filteredFieldList[i] || this.filteredFieldList[i].length === 0) {
              this.filteredFieldList[i] = [...fields];
            }
          });
        },
        error: (err) => console.error('Error loading fields:', err)
      });

    if (!this.parameters?.controls?.length) {
      this.loadParameters(queryId);
    }
  }

  loadParameters(queryId: number): void {
    this.EventService.getActiveEventparametername(queryId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.parameterList = res || [];
        },
        error: (error) => console.error('Error loading parameters', error)
      });
  }

  updateQueryPreview(): void {
    if (!this.baseQueryText) {
      return;
    }

    const parametersArray = this.parameters.value || [];
    let query = this.baseQueryText.trim();

    if (!query.toUpperCase().includes('WHERE')) {
      query += ' WHERE ';
    } else if (!query.toUpperCase().endsWith('WHERE')) {
      const whereIndex = query.toUpperCase().lastIndexOf('WHERE');
      query = query.substring(0, whereIndex + 5).trim() + ' ';
    }

    const conditions: string[] = [];

    parametersArray.forEach((param: any, index: number) => {
      const open = param.opening_bracket || '';
      const field = param.parameter_text;
      const cond = param.parameter_condition;
      const value = param.parameter_value;
      const close = param.closing_bracket || '';
      let conj = (param.parameter_conjunction || '').toUpperCase();

      if (!field || !cond || !value) {
        return;
      }

      let condSymbol = cond;
      switch (cond) {
        case 'Equal to': condSymbol = '='; break;
        case 'Not Equal to': condSymbol = '!='; break;
        case 'Greater than': condSymbol = '>'; break;
        case 'Less than': condSymbol = '<'; break;
        case 'Greater than or Equal to': condSymbol = '>='; break;
        case 'Less than or Equal to': condSymbol = '<='; break;
        case 'LIKE': condSymbol = 'LIKE'; break;
      }

      let valStr = `'${value}'`;
      if (cond.toUpperCase() === 'LIKE') {
        valStr = `'%${value}%'`;
      }

      let conditionStr = `${open}${field} ${condSymbol} ${valStr}${close}`;

      if (conj && conj !== 'ONLY' && index < parametersArray.length - 1) {
        conditionStr += ` ${conj}`;
      }

      conditions.push(conditionStr);
    });

    if (conditions.length > 0) {
      this.selectedQueryText = query + ' ' + conditions.join(' ');
    } else {
      this.selectedQueryText = this.baseQueryText;
    }
  }

  filterQueries(): void {
    const search = this.querySearch.toLowerCase();
    this.filteredQueryList = this.queryList.filter(item =>
      item.query_name.toLowerCase().includes(search)
    );
  }

  filterFieldList(index: number): void {
    const searchValue = (this.fieldSearch[index] || '').toLowerCase();

    if (!this.filteredFieldList[index]) {
      this.filteredFieldList[index] = [];
    }

    this.filteredFieldList[index] = [];
    
    if (this.parameterList && this.parameterList.length > 0) {
      this.parameterList.forEach(item => {
        if (item.field_name && item.field_name.toLowerCase().includes(searchValue)) {
          this.filteredFieldList[index].push(item);
        }
      });
    }
  }

  filterValueList(index: number): void {
    const searchValue = (this.valueSearch[index] || '').toLowerCase();
    const allValues = this.parameterValueList[index] || [];

    this.filteredValueList[index] = allValues.filter(val =>
      val.sDefaultValue.toLowerCase().includes(searchValue)
    );
  }

  onQueryDropdownOpened(opened: boolean): void {
    if (!opened) {
      this.querySearch = '';
      this.filteredQueryList = [...this.queryList];
    }
  }

  onFieldDropdownOpened(index: number, isOpen: boolean): void {
    if (!isOpen) return;

    // Clear and reassign to avoid duplicates
    this.filteredFieldList[index] = [...(this.parameterList || [])];
    this.fieldSearch[index] = '';
  }

 onFieldNameChanged(index: number): void {
  const conditionGroup = this.parameters.controls[index];
  const fieldName = conditionGroup.get('parameter_text')?.value;

  if (!fieldName || !this.selectedQueryTableName) return;

  conditionGroup.patchValue({
    parameter_value: '', 
    table_name: this.selectedQueryTableName
  });

  this.filteredValueList[index] = [];
  this.parameterValueList[index] = [];
  this.manualValueAllowed[index] = false;
  this.valueSearch[index] = '';

  this.EventService.getEventsFieldValues(this.selectedQueryTableName, fieldName).subscribe({
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



  // onValueDropdownOpened(index: number, isOpen: boolean, tableName: string, fieldName: string): void {
  //   if (!isOpen) return;

  //   // Initialize arrays if not present
  //   if (!this.filteredValueList[index]) this.filteredValueList[index] = [];
  //   if (!this.parameterValueList[index]) this.parameterValueList[index] = [];
    
  //   this.filteredValueList[index] = [];
  //   this.manualValueAllowed[index] = false;

  //   this.EventService.getEventsFieldValues(tableName, fieldName)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (res: any) => {
  //         if (res.records && res.records.length > 0) {
  //           const raw = res.records[0].sDefaultValue;

  //           if (raw && raw.trim() !== "") {
  //             const rawValues = raw.split(',').map((v: string) => v.trim());
  //             const values = rawValues.filter((_: any, i: number) => i % 2 === 1);
  //             const valueObjects = values.map((v: string) => ({ sDefaultValue: v }));

  //             this.filteredValueList[index] = [...valueObjects];
  //             this.parameterValueList[index] = [...valueObjects];
  //             this.manualValueAllowed[index] = valueObjects.length === 0;
  //           } else {
  //             this.filteredValueList[index] = [];
  //             this.parameterValueList[index] = [];
  //             this.manualValueAllowed[index] = true;
  //           }
  //         } else {
  //           this.filteredValueList[index] = [];
  //           this.parameterValueList[index] = [];
  //           this.manualValueAllowed[index] = true;
  //         }

  //         this.valueSearch[index] = '';
  //       },
  //       error: (err) => {
  //         console.error('Error fetching field values:', err);
  //         this.filteredValueList[index] = [];
  //         this.parameterValueList[index] = [];
  //         this.valueSearch[index] = '';
  //         this.manualValueAllowed[index] = true;
  //       }
  //     });
  // }

  populateFiltersFromParameters(params: any[]): void {
    const parametersArray = this.parameters;
    parametersArray.clear();

    this.EventService.getEventPlannerFiltersById(this.event_planner_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (plannerFilters: any[]) => {
          if (!plannerFilters || plannerFilters.length === 0) {
            this.clearParameters();
            return;
          }

          const queryId = plannerFilters[0].query_id;

          this.EventService.getActiveEventparametername(queryId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (paramDetails: any[]) => {
                params.forEach((param, i) => {
                  const conditionGroup = this.fb.group({
                    opening_bracket: [param.opening_bracket || ''],
                    parameter_text: [param.parameter_text || '', Validators.required],
                    parameter_condition: [param.parameter_condition || '', Validators.required],
                    parameter_value: [param.parameter_value || ''],
                    closing_bracket: [param.closing_bracket || ''],
                    table_name: [''],
                    field_name: [''],
                    parameter_conjunction: [param.parameter_conjunction || '', Validators.required],
                    parameter_desc: [param.parameter_desc || '']
                  });

                  this.subscribeToConditionChanges(conditionGroup);
                  parametersArray.push(conditionGroup);

                  const match = paramDetails.find(
                    (p: any) => p.parameter_text === param.parameter_text
                  );

                  this.addEditForm.patchValue({
                    parameter_desc: plannerFilters[0]?.parameter_desc || ''
                  }, { emitEvent: false });

                  if (match) {
                    conditionGroup.patchValue({
                      table_name: match.table_name,
                      field_name: match.field_name
                    }, { emitEvent: false });

                   // this.onValueDropdownOpened(i, true, match.table_name, match.field_name);
                  }

                  this.filteredFieldList[i] = [...(this.parameterList || [])];
                });

                if (queryId) {
                  this.onQuerySelected(queryId);
                }
              },
              error: (err) => {
                console.error('Error fetching parameter details:', err);
                this.clearParameters();
              }
            });
        },
        error: (err) => {
          console.error('Error fetching event planner filters:', err);
          this.clearParameters();
        }
      });
  }

  loadEventPlannerTable(eventPlannerId: number): void {
    if (!eventPlannerId) return;

    this.EventService.getEventPlannerFiltersById(eventPlannerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.dataSource.data = res || [];

          if (!res || res.length === 0) return;

          const queryId = res[0].query_id;
           const rawDay = res[0].calendar_day;
      let parsedDate = rawDay ? new Date(rawDay) : null;

      if (rawDay && rawDay.length === 6) {
        const [monthStr, dayStr] = rawDay.split('-');
        const year = new Date().getFullYear();
        parsedDate = new Date(`${monthStr} ${dayStr}, ${year}`);
      }


          this.EventService.getActiveEventparametername(queryId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (params: any) => {
                this.parameterList = params || [];

                const parametersArray = this.addEditForm.get('parameters') as FormArray;
                parametersArray.clear();

                res.forEach((filter: any, i: number) => {
                  const conditionGroup = this.fb.group({
                    opening_bracket: [filter.opening_bracket || ''],
                    parameter_text: [filter.parameter_text || '', Validators.required],
                    parameter_condition: [filter.parameter_condition || '', Validators.required],
                    parameter_value: [filter.parameter_value || '', Validators.required],
                    closing_bracket: [filter.closing_bracket || ''],
                    table_name: [filter.table_name || ''],
                    field_name: [filter.field_name || ''],
                    parameter_conjunction: [filter.parameter_conjunction || '', Validators.required]
                  });

                  //this.onValueDropdownOpened(i, true, filter.table_name || '', filter.field_name || '');

                  this.subscribeToConditionChanges(conditionGroup);
                  parametersArray.push(conditionGroup);
                  this.filteredFieldList[i] = [...(this.parameterList || [])];
                });

                this.addEditForm.patchValue({
                  query_id: queryId,
                  parameter_desc: res[0].parameter_desc,
                  event_planner_id: eventPlannerId,
                  status: res[0].status?.toString() || '1',
                  calendar_day: this.parseCalendarDay(res[0].calendar_day)
                }, { emitEvent: false });
                
                this.onQuerySelected(queryId);
              },
              error: (error) => console.error('Error loading parameter list', error)
            });
        },
        error: (error) => console.error('Error loading event planner table', error)
      });
  }

  getEventPlannerName(): string {
    const id = this.addEditForm.get('event_planner_id')?.value;
    const planner = this.EventList.find(p => p.event_planner_id === id);
    return planner ? planner.event_planner_title : '';
  }

  openCreateQueryDialog(): void {
    this.router.navigate(['/create_event_query'], {
      queryParams: { returnTo: '/create_event_planner' }
    });
  }

  deleteFilterRow(element: any): void {
    const userId = 1;
    this.EventService.deleteFilter(element.filter_id, userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(item => item.parameter_id !== element.parameter_id);
          Swal.fire({
            icon: 'success',
            title: 'Filter deleted successfully',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
        },
        error: (error) => console.error('Error deleting filter', error)
      });
  }

submitForm(): void {
 
  if (!this.selectedFile) {
    this.plannerDetailsExpanded = true;
    Swal.fire({
      icon: 'error',
      title: 'Image Required',
      text: 'Please upload an event image.',
      confirmButtonText: 'OK'
    });
    return;
  }

  if (this.parameters.length === 0) {
    this.filterDetailsExpanded = true;
    Swal.fire({
      icon: 'error',
      title: 'Event Filter Required',
      text: 'Please add event filter before submitting.',
      confirmButtonText: 'OK'
    });
    return;
  }

  const params = this.parameters.value;
  let openCount = 0;
  let closeCount = 0;

  for (let i = 0; i < params.length; i++) {
    const p = params[i];
    const row = i + 1;

    if (p.opening_bracket && p.opening_bracket !== '(') {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Opening Bracket',
        text: `Row ${row}: Opening bracket should be "(" only.`,
        confirmButtonText: 'OK'
      });
      return;
    }

    if (p.closing_bracket && p.closing_bracket !== ')') {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Closing Bracket',
        text: `Row ${row}: Closing bracket should be ")" only.`,
        confirmButtonText: 'OK'
      });
      return;
    }

    if (p.opening_bracket === '(') openCount++;
    if (p.closing_bracket === ')') closeCount++;

    if (closeCount > openCount) {
      Swal.fire({
        icon: 'error',
        title: 'Bracket Order Error',
        text: `Row ${row}: A closing bracket appears before an opening bracket.`,
        confirmButtonText: 'OK'
      });
      return;
    }
    if (p.closing_bracket === ')' && params[i + 1]?.opening_bracket === '(') {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Bracket Sequence',
        text: `Row ${row}: Closing bracket cannot be directly followed by an opening bracket.`,
        confirmButtonText: 'OK'
      });
      return;
    }

    if (i === params.length - 1) {
      if (p.parameter_conjunction && p.parameter_conjunction.toLowerCase() !== 'only') {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Last Conjunction',
          text: `Row ${row}: The last row can only have conjunction "only".`,
          confirmButtonText: 'OK'
        });
        return;
      }

      const onlyCount = params.filter((x: any) =>
        x.parameter_conjunction?.toLowerCase() === 'only'
      ).length;

      if (onlyCount > 1) {
        Swal.fire({
          icon: 'error',
          title: 'Duplicate "Only" Conjunction',
          text: 'The conjunction "only" is allowed once — and only in the last row.',
          confirmButtonText: 'OK'
        });
        return;
      }
    }
  }
  if (openCount !== closeCount) {
    Swal.fire({
      icon: 'error',
      title: 'Unbalanced Brackets',
      text: `Opening "(" and closing ")" brackets must be equal. Found ${openCount} open and ${closeCount} close.`,
      confirmButtonText: 'OK'
    });
    return;
  }

  if (!this.addEditForm.valid) {
    this.isShowErrors = true;
    return;
  }

  const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
  this.userid = obj[0]?.login_id;

  const formData = new FormData();
  formData.append('event_planner_title', this.addEditForm.value.event_planner_title);
  formData.append('schedule_id', this.addEditForm.value.schedule_id);
  formData.append('schedule_type', this.addEditForm.value.schedule_type);
  formData.append('event_planner_status', this.addEditForm.value.event_planner_status);
  formData.append('event_id', this.addEditForm.value.event_id);
  formData.append('template_id', this.addEditForm.value.template_id);
  formData.append('event_planner_expiry_days', this.addEditForm.value.event_planner_expiry_days);
  formData.append('calendar_day', this.addEditForm.value.calendar_day.toISOString());
  formData.append('country_name', this.addEditForm.value.country_name || '');
  formData.append('mode_of_message', JSON.stringify(this.addEditForm.value.mode_of_message));
  formData.append('event_planner_image', this.selectedFile!);
  formData.append('userid', this.userid);

  this.EventService.createEventPlanner(formData)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (plannerResponse: any) => {
        console.log("Planner Response:", plannerResponse);

        if (plannerResponse?.message === 'Event Planner Already Exist') {
          Swal.fire({
            icon: 'warning',
            title: 'Duplicate Event Planner',
            text: 'Event Planner Already Exist',
            confirmButtonText: 'OK'
          });
          return;
        }

        const eventPlannerId = plannerResponse?.data?.event_planner_id;
        if (!eventPlannerId) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to retrieve Event Planner ID.',
            confirmButtonText: 'OK'
          });
          return;
        }

        const parametersWithId = this.parameters.value.map((p: any) => ({
          ...p,
          event_planner_id: eventPlannerId
        }));

        const filterData = {
          ...this.addEditForm.value,
          event_planner_id: eventPlannerId,
          parameters: parametersWithId,
          userid: this.userid
        };

        this.EventService.createEventPlannerfilter(filterData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Event Planner and Filters created successfully.'
              }).then(() => this.router.navigate(['/event_planner']));
            },
            error: (err) => {
              console.error('Error creating filter:', err);
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Event Planner created, but failed to save filters.'
              });
            }
          });
      },
      error: (err) => {
        console.error('Error creating event planner:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to create Event Planner.',
          confirmButtonText: 'OK'
        });
      }
    });
}




  cancel(): void {
    this.router.navigate(['/event_planner']);
  }
}