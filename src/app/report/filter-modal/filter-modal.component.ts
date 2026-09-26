import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ErrorlogService } from 'src/app/errorlog.service';
import { ReportsService } from 'src/app/service/reports/reports.service';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.css']
})
export class FilterModalComponent implements OnInit {
  filterForm: FormGroup;
  columnsData: any[] = [];
  filterOptions: { [key: number]: Observable<any[]> } = {};
  showFilterContainer = false;
  errorMessage: string | null = null;
  private subscriptions: Subscription[] = [];
  existingFilters: any;
  constructor(
    public dialogRef: MatDialogRef<FilterModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,  
    private cdRef: ChangeDetectorRef,
    private reportsService: ReportsService,private errorlogService: ErrorlogService
  ) {
    this.columnsData = data.columnsData || [];
    this.existingFilters = data.existingFilters;
    this.filterForm = this.fb.group({
      filters: this.fb.array([])  // Initialize as an empty FormArray
    });
    // Initialize filters with existing filters if available
    this.initializeFilters(data.existingFilters || []);
  }

  get filtersArray(): FormArray {
    return this.filterForm.get('filters') as FormArray;
  }

  ngOnInit(): void {
    this.subscribeToFilterArrayChanges();

    if (this.existingFilters) {
      this.existingFilters.forEach((filter: any, index: number) => {
        // Delay to ensure the form control is fully initialized
        setTimeout(() => {
          this.onSelectedFieldChange(index);
        }, 0);
      });
    }
  }

  private subscribeToFilterArrayChanges(): void {
    this.filtersArray.valueChanges.subscribe(() => {
      this.errorMessage = null; 
    });
  }



  getFieldType(field: string): string {
    const filterField = this.columnsData.find(item => item.fieldName === field);
    return filterField ? filterField.type : 'text';
  }

  getFieldOptions(index: number): Observable<any[]> {
    // Ensure that filterOptions[index] is an observable
    return this.filterOptions[index] || of([]);
  }

  onFilterCriteriaChange(inputValue: string, index: number): void {
    const selectedField = this.filtersArray.at(index).get('selectedField')?.value;
    const tableName = this.columnsData.find(field => field.fieldName === selectedField)?.tableName || '';
  
    if (tableName && selectedField) {
      this.reportsService.getOptionsAutoComplete(tableName, selectedField).pipe(
        switchMap((options: (string | number)[]) => {
          // Ensure TypeScript understands the possible types of options
          const filteredOptions = options.filter(option => {
            if (typeof option === 'string') {
              // String filtering
              return option.toLowerCase().includes(inputValue.toLowerCase());
            } else if (typeof option === 'number') {
              // Number filtering
              return option.toString().includes(inputValue);
            }
            // Return false for other types
            return false;
          });
          return of(filteredOptions);
        })
      ).subscribe({
        next: filteredOptions => {
          this.filterOptions[index] = of(filteredOptions); // Update the filtered options for this index
        },
        error: err => {
          console.error('Error fetching options:', err);
          this.filterOptions[index] = of([]); // Provide empty options on error
        }
      });
    } else {
      this.filterOptions[index] = of([]); // Provide empty options if no tableName
    }
  }

  onDateChange(event: any, index: number): void {
    const selectedDate = event.value;
  
    if (selectedDate) {
      // Create a new Date object from the selected date
      const localDate = new Date(selectedDate);
  
      // Ensure the date part is set without any time component
      localDate.setHours(0, 0, 0, 0); // Set to midnight (start of the day)
  
      // Add one day to the date if needed
      localDate.setDate(localDate.getDate());
  
      // Convert to YYYY-MM-DD format
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(localDate.getDate()).padStart(2, '0');
  
      const formattedDate = `${year}-${month}-${day}`;
  
      // Get the form control for the specific index in the FormArray
      const filterControl = this.filtersArray.at(index);
  
      // Update the form control value with the formatted date
      filterControl.get('filterCriteria')?.setValue(formattedDate);
    }
  }

  initializeFilters(existingFilters: any[]): void {
    console.log(existingFilters)
    if (existingFilters.length > 0) {
      existingFilters.forEach(filterData => this.addFilter(filterData));
    } else {
      this.addFilter(); // Add a default row of filter if no existing filters
    }
  }

  addFilter(filterData: any = {}): void {
    // Check if there are existing filters
    if (this.filtersArray.length > 0) {
      const lastFilterGroup = this.filtersArray.at(this.filtersArray.length - 1) as FormGroup;
      const lastLogicalOperator = lastFilterGroup.get('logicalOperator')?.value;
  
      // If the last logical operator is 'ONLY', change it to 'AND'
      if (lastLogicalOperator === 'ONLY') {
        lastFilterGroup.get('logicalOperator')?.setValue('AND');
      }
    }
  
    // Create a new filter group and add it to the FormArray
    const filterGroup = this.fb.group({
      selectedField: [filterData.selectedField || '', Validators.required],
      comparisonOperator: [filterData.comparisonOperator || '=', Validators.required],
      filterCriteria: [filterData.filterCriteria !== undefined ? filterData.filterCriteria : '', Validators.required],
      logicalOperator: [filterData.logicalOperator || 'ONLY', Validators.required]
    });
  
    this.filtersArray.push(filterGroup);
  
    // Initialize filter options for the new filter
    // this.onSelectedFieldChange(this.filtersArray.length - 1);
  }

  removeFilter(index: number): void {
    if (this.filtersArray.length > 1) {
      this.filtersArray.removeAt(index);
      delete this.filterOptions[index];  // Remove the corresponding options
    }
  }

  onSelectedFieldChange(index: number): void {
    const filterGroup = this.filtersArray.at(index) as FormGroup;
    const selectedField = filterGroup.get('selectedField')?.value;
    const tableName = this.columnsData.find(field => field.fieldName === selectedField)?.tableName || '';
  
    if (tableName) {
      this.reportsService.getOptionsAutoComplete(tableName, selectedField).subscribe({
        next: options => {
          this.filterOptions[index] = of(options); // Update options for this index
        },
        error: err => {
          console.error('Error fetching options:', err);
          this.filterOptions[index] = of([]); // Provide empty options on error
        }
      });
    } else {
      this.filterOptions[index] = of([]); // Provide empty options if no tableName
    }
  }

  canAddFilter(): boolean {
    return this.filtersArray.controls.every(control => control.valid);
  }

  applyFilter(): void {
    const filters = this.filterForm.value.filters;
    let isLogicalOperatorValid = true;
    let isLastRowValid = true;
  
    // Check if 'ONLY' is used in any row other than the last one
    for (let i = 0; i < filters.length - 1; i++) {
      if (filters[i].logicalOperator === 'ONLY') {
        isLogicalOperatorValid = false;
        break;
      }
    }
  
    // Check if the last row has 'ONLY' as the logical operator
    if (filters.length > 1) {
      isLastRowValid = filters[filters.length - 1].logicalOperator === 'ONLY';
    }
  
    // Check form validity, logical operator validity, and last row condition
    if (!this.filterForm.valid) {
      this.errorlogService.logFormErrors(this.filterForm, 'addForm Form is invalid. Please check all fields.');
      this.errorMessage = 'Form is invalid. Please check all fields.';
    } else if (!isLogicalOperatorValid) {
      this.errorlogService.logFormErrors(this.filterForm, 'addForm Before the last row, "ONLY" logical operator is not allowed.');
      this.errorMessage = 'Before the last row, "ONLY" logical operator is not allowed.';
    } else if (filters.length > 1 && !isLastRowValid) {
      this.errorlogService.logFormErrors(this.filterForm, 'addForm The last row must end with the "ONLY" logical operator.');
      this.errorMessage = 'The last row must end with the "ONLY" logical operator.';
    } else {
      this.errorMessage = null; // Clear any previous error message
      this.dialogRef.close(filters);
      console.log(filters);
    }
  }

  clearAllFilters(): void {
    this.errorMessage = null; // Reset the error message
    
    // Remove all filter rows
    while (this.filtersArray.length > 0) {
      this.filtersArray.removeAt(0);
    }
  
    // Add a new empty filter row
    this.addFilter();
  }


  onNoClick(): void {
   
  // Close the dialog
  this.dialogRef.close();
  }

  toggleFilterContainer(): void {
    this.showFilterContainer = !this.showFilterContainer;
  }
  mapOptionLabel(option: any): string {
    if (option === 1) {
      return 'Active';
    } else if (option === 0) {
      return 'In-Active';
    }
    return option; // Return the original value if it's not 1 or filtersArray
  }



  

}