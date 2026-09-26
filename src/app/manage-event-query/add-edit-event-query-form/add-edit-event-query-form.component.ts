import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Optional, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { AddEventTableFieldFormComponent } from 'src/app/manage-event-table-field/add-event-table-field-form/add-event-table-field-form.component';
import { AddEventTableFormComponent } from 'src/app/manage-event-table/add-event-table-form/add-event-table-form.component';
import { CookieService } from 'src/app/service/cookie.service';
import { EventService } from 'src/app/service/event/event.service';
import Swal from 'sweetalert2';
interface Table {
  table_id: number;
  table_name: string;
  status: number;
  created_by: number;
  created_at: string;
}

interface Field {
  COLUMN_NAME: string;
  DATA_TYPE: string;
}

@Component({
  selector: 'app-add-edit-event-query-form',
  templateUrl: './add-edit-event-query-form.component.html',
  styleUrls: ['./add-edit-event-query-form.component.css']
})
export class AddEditEventQueryFormComponent implements OnInit {

  addEditForm!: FormGroup;
@ViewChild('fieldSelect') matSelect!: MatSelect;
  tableList: Table[] = [];
  filteredTableList: Table[] = [];
  selectedTable: Table | null = null;
  tableFilter: string = '';

  fieldList: Field[] = [];
  filteredFields: Field[] = [];
  fieldFilter: string = '';

  generatedQuery: string = '';
  currentUser: any;
  queryList: any;
  filteredQueryList: any;
  navState: any;


  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private eventService: EventService,
    private router: Router,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    @Optional() public dialogRef?: MatDialogRef<AddEditEventQueryFormComponent>,
  ) {}

  ngOnInit(): void {
     this.addEditForm = this.fb.group({
      query_name: ['', Validators.required],
      table_name: ['', Validators.required],
      field_name: [[], Validators.required], 
      status: ['1', Validators.required]
    });
       this.navState = history.state;

  if (this.navState?.formData) {
    this.addEditForm.patchValue(this.navState.formData);
  }

  if (this.navState?.newQuery) {
    const newQuery = this.navState.newQuery;

    const exists = this.queryList?.some(q => q.query_id === newQuery.query_id);
    if (!exists) {
      this.queryList = [newQuery, ...(this.queryList || [])];
      this.filteredQueryList = [...this.queryList];
    }

    this.addEditForm.get('query_id')?.setValue(newQuery.query_id);
  }
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
   


    this.loadTableList();
    
  }

  loadTableList(): void {
    this.eventService.getActiveEventTableList().subscribe({
      next: (res: Table[]) => {
        this.tableList = res;
        this.filteredTableList = [...this.tableList];
      },
      error: err => console.error('Failed to load tables', err)
    });
  }

  filterTables(): void {
    const filter = this.tableFilter.toLowerCase();
    this.filteredTableList = this.tableList.filter(t =>
      t.table_name.toLowerCase().includes(filter)
    );
  }

 onTableSelectionChange(selectedTableName: string): void {
  const table = this.filteredTableList.find(t => t.table_name === selectedTableName) || null;
  this.selectedTable = table;
  this.addEditForm.patchValue({ table_name: selectedTableName, field_name: [] });

  this.fieldList = [];
  this.filteredFields = [];
  this.fieldFilter = '';

  if (table) {
    this.loadFieldsForTable(table.table_name);
    this.generatedQuery = `SELECT * FROM vmCore_${table.table_name}`;
  }
}


  loadFieldsForTable(tableName: string): void {
    this.eventService.getEventsTableFields(tableName).subscribe({
      next: (res: Field[]) => {
        this.fieldList = res;
        this.filteredFields = [...this.fieldList];
      },
      error: err => console.error('Failed to load fields', err)
    });
  }




  
  filterFields(): void {
    const filter = this.fieldFilter.toLowerCase();
    this.filteredFields = this.fieldList.filter(f =>
      f.COLUMN_NAME.toLowerCase().includes(filter)
    );
  }

  updateQueryText(): void {
    const tableName = this.selectedTable?.table_name || '';
    const selectedFields: Field[] = this.addEditForm.value.field_name || [];
    if (!tableName) return;

    if (tableName.length) {
      
      this.generatedQuery = `SELECT * FROM vmCore_${tableName}`;
    }
  }

openCreateTableDialog(): void {
  const dialogRef = this.dialog.open(AddEventTableFormComponent, {
    width: '600px',
    disableClose: true
  });


  dialogRef.afterClosed().subscribe(result => {
    if (result?.data?.table_id) { 
      const newTable = result.data;

      const exists = this.tableList.some(t => t.table_name === newTable.table_name);
      if (!exists) {
        this.tableList = [newTable, ...this.tableList];
       
      }
      this.filteredTableList = [...this.tableList];
      this.addEditForm.get('table_name')?.setValue(newTable.table_name);
      this.selectedTable = newTable;

      this.loadFieldsForTable(newTable.table_name);
      this.generatedQuery = `SELECT * FROM vmCore_${newTable.table_name}`;

     
    }
  });
}



  openCreateFieldDialog(event?: Event): void {
    event?.stopPropagation(); 
    this.matSelect?.close(); 
    const dialogRef = this.dialog.open(AddEventTableFieldFormComponent, { width: '600px', disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.COLUMN_NAME) {
        this.fieldList.push(result);
        this.filteredFields = [...this.fieldList];
        this.addEditForm.patchValue({ field_name: [...this.addEditForm.value.field_name, result] });
        this.updateQueryText();
        this.snackBar.open(`Field "${result.COLUMN_NAME}" created successfully`, 'Close', { duration: 2000 });
      }
    });
    
  }

  saveQuery(): void {
    if (this.addEditForm.invalid || !this.selectedTable) {
      console.log("selectedTable",this.selectedTable)
        Swal.fire({ toast: true, position: 'top-end', icon: 'error', title:'Please fill all required fields', showConfirmButton: false, timer: 2500 });
      return;
    }

    const selectedFields: Field[] = this.addEditForm.value.field_name || [];
    const obj = this.currentUser ? JSON.parse(this.currentUser) : null;
    const userid = obj ? obj[0]?.login_id : null;

    const payload = {
      query_name: this.addEditForm.value.query_name,
      query_text: this.generatedQuery,
      table_id: this.selectedTable.table_id,
      status: this.addEditForm.value.status,
      fields: selectedFields.map(f => ({ field_name: f.COLUMN_NAME, field_type: f.DATA_TYPE })),
      userid
    };
    this.eventService.createQuery(payload).subscribe({
      
      next: (res: any) => {
        if (res.success) {
          
   console.log("table_id",payload.table_id)
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: res.message, showConfirmButton: false, timer: 2500 });
           if (this.dialogRef) {
    this.dialogRef.close('Success');
  } else {
      //const returnUrl = this.route.snapshot.queryParams['returnTo'] || '/event_query';
      const returnUrl = this.navState?.returnTo || '/event_query';

  this.router.navigate([returnUrl], {
    state: { newQuery: res.data,
    
    formData: this.navState?.formData,
    selectedQueryId: this.navState?.selectedQueryId 
    }
  });
  }
        } 
         else if(res.message == "Event Query already exists"){
               Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: res.message || 'Event Query already exists', showConfirmButton: false, timer: 2500 });
              return
            }else {
         Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Error saving query', showConfirmButton: false, timer: 2500 });
        }
      },
      error: (err) => {
        console.error(err);
        Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Error saving query', showConfirmButton: false, timer: 2500 });
      }
    });
  }

 onCancel() {
  
  //const returnUrl = this.route.snapshot.queryParams['returnTo'] || '/event_query';

  const returnUrl = this.navState?.returnTo || '/event_query';
  this.router.navigate([returnUrl], {
    state: { 
      formData: this.navState?.formData,
      selectedQueryId: this.navState?.selectedQueryId
    }
  });

  
}



}
