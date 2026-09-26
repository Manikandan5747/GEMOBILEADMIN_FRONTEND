import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CookieService } from 'src/app/service/cookie.service';
import { EventService } from 'src/app/service/event/event.service';
import Swal from 'sweetalert2';

interface Table {
  table_id: number;
  table_name: string;
}

@Component({
  selector: 'app-edit-event-query-form',
  templateUrl: './edit-event-query-form.component.html',
  styleUrls: ['./edit-event-query-form.component.css']
})
export class EditEventQueryFormComponent implements OnInit {

  addEditForm!: FormGroup;
  isLoading = true;
  query_id!: number;
  tableList: Table[] = [];
  currentUser: any;
  userid: any;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private cookieService: CookieService,
    public dialogRef: MatDialogRef<EditEventQueryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    this.query_id = this.data?.query_id;
    this.initForm();
    this.loadTableList();

    if (this.query_id) {
      this.loadQueryDetails();
    } else {
      this.isLoading = false;
    }
  }

  initForm() {
    this.addEditForm = this.fb.group({
      query_id: [],
      query_name: ['', Validators.required],
      table_name: ['', Validators.required],
      table_id: ['', Validators.required],
      query_text: [''],
      status: [1, Validators.required]
    });
  }

  loadTableList() {
    this.eventService.getActiveEventTableList().subscribe({
      next: (res: Table[]) => this.tableList = res,
      error: (err) => console.error('Failed to load tables', err)
    });
  }

  loadQueryDetails() {
    this.eventService.getEventQueryById(this.query_id).subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res[0] : res;
        console.log("data",data)
        this.addEditForm.patchValue({
          query_name: data.query_name,
          query_id: data.query_id,
          table_name:data.table_name,
          table_id:data.table_id,
          query_text: data.query_text,
          status: data.status
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching query details:', err);
        this.isLoading = false;
      }
    });
  }

 
onTableSelectionChange(selectedTableName: string) {
  if (!selectedTableName) return;

  const selectedTable = this.tableList.find(t => t.table_name === selectedTableName);
  if (!selectedTable) return;
  this.addEditForm.patchValue({
    table_name: selectedTable.table_name,
    table_id: selectedTable.table_id,
    query_text: `SELECT * FROM vmCore_${selectedTable.table_name}`
  });
}





  update() {
    if (this.addEditForm.invalid) return;
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      this.userid = obj[0]?.login_id;


    const payload = {
      query_id: this.addEditForm.value.query_id,
      query_name: this.addEditForm.value.query_name,
      table_id: this.addEditForm.value.table_id,
      table_name: this.addEditForm.value.table_name,
      query_text: this.addEditForm.value.query_text,
      status: this.addEditForm.value.status,
      userid:this.userid
    };
console.log("payload",payload)
    this.eventService.updateEventQuery(payload).subscribe({
      next: (res) => {
          if (res.success) {
           
                  Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Query updated successfully',
          showConfirmButton: false,
          timer: 2000
        });
        this.dialogRef.close('Success');
        } 
        else if(res.message == "Event Query already exists"){
          Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: res.message || 'Event Query already exists', showConfirmButton: false, timer: 2500 });
            return
        }
        else if(res.message == "Event Query is in Transaction"){
        Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: res.message || 'Event Query is in Transaction', showConfirmButton: false, timer: 2500 });
        return
        }
        else{
         Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Error saving query', showConfirmButton: false, timer: 2500 });
                            }
       
      },

      
      error: (err) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Update failed',
          showConfirmButton: false,
          timer: 2000
        });
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
