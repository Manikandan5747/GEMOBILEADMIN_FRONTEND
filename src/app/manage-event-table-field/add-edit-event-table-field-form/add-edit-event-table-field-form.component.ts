import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { EventService } from 'src/app/service/event/event.service';
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
interface Field {
  COLUMN_NAME: string;
  DATA_TYPE: string;
}
@Component({
  selector: 'app-add-edit-event-table-field-form',
  templateUrl: './add-edit-event-table-field-form.component.html',
  styleUrls: ['./add-edit-event-table-field-form.component.css']
})


export class AddEditEventTableFieldFormComponent implements OnInit {
  @Input() action!: any;
  @Input() isShowErrors!: boolean;
  @Input() field_id!: any;
  @Input() table_id!: any;

  public matcher = new ErrorMatcherService();
  public errors = errorMessages;
  public addEditForm!: FormGroup;

  mainTableList: any[] = [];
  mainFieldList: any[] = [];
  filteredTableList!: Observable<any[]>;
  filteredFields: any[] = [];
  selectedFields: any[] = [];

  fieldFilter: string = '';

  constructor(private fb: FormBuilder, private EventService: EventService,    private router: Router) {}

  ngOnInit(): void {
    this.addEditForm = this.fb.group({
      table_id: [null, Validators.required],
      field_name: [[], Validators.required],
      status: ['1']
    });

    this.loadEventTables();

    this.addEditForm.get('table_id')?.valueChanges.subscribe(value => {
      if (typeof value === 'string') {
        this.filteredTableList = this.getFilteredTableList(value);
        const matchedTable = this.mainTableList.find(
          t => t.table_name.toLowerCase() === value.toLowerCase()
        );

        if (matchedTable) {
          this.addEditForm.get('table_id')?.setErrors(null);
          this.loadEventFields(matchedTable.table_name);
        } else {
          this.addEditForm.get('table_id')?.setErrors({ invalidTable: true });
          this.mainFieldList = [];
          this.filteredFields = [];
          this.addEditForm.patchValue({ field_name: [] }, { emitEvent: false });
        }
      }
    });
  }

  onTableSelected(selectedTable: any): void {
    if (selectedTable) {
      this.addEditForm.patchValue({ table_id: selectedTable });
      this.addEditForm.get('table_id')?.setErrors(null);
      this.loadEventFields(selectedTable.table_name);
    }
  }

  loadEventTables(): void {
    this.EventService.getEventsTable().subscribe((res: any[]) => {
      this.mainTableList = res;
      this.filteredTableList = this.getFilteredTableList('');
    });
  }

  loadEventFields(tableName: string): void {
    if (!tableName) {
      this.mainFieldList = [];
      this.filteredFields = [];
      return;
    }

    this.EventService.getEventsTableFields(tableName).subscribe((res: any[]) => {
      this.mainFieldList = res;
      this.filteredFields = [...this.mainFieldList];
    });
  }

  getFilteredTableList(value: string): Observable<any[]> {
    const filterValue = value.toLowerCase();
    return of(this.mainTableList.filter(option =>
      option.table_name.toLowerCase().includes(filterValue)
    ));
  }
public patchFormForEdit(data: any) {
  const patchData = () => {
    const tableObj = this.mainTableList.find(t => t.table_id === data.table_id);

    this.addEditForm.patchValue({
      table_id: tableObj || { table_id: data.table_id, table_name: data.table_name },
      field_name: data.field_name ? [data.field_name] : [],  
      status: data.status === 'inactive' ? '0' : '1'
    });

    if (data.field_name) {
      this.selectedFields = [{ COLUMN_NAME: data.field_name }];
    }

    if (data.table_name) {
      this.loadEventFields(data.table_name);
    }
  };

  if (this.mainTableList.length > 0) {
    patchData();
  } else {
    this.EventService.getEventsTable().subscribe(tables => {
      this.mainTableList = tables;
      patchData();
    });
  }
}


  filterFields(): void {
    const filterValue = this.fieldFilter.toLowerCase();
    this.filteredFields = this.mainFieldList.filter(field =>
      field.COLUMN_NAME.toLowerCase().includes(filterValue)
    );
  }

  displayFn(table: any): string {
    return table && table.table_name ? table.table_name : '';
  }

  onFieldsSelected(event: any): void {
    this.selectedFields = event.value; 
  }




}
