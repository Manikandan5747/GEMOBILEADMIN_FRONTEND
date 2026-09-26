import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'src/app/service/cookie.service';
import { ManageModuleService } from 'src/app/service/manage-module/manage-module.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-related-module-privilege',
  templateUrl: './related-module-privilege.component.html',
  styleUrls: ['./related-module-privilege.component.css']
})
export class RelatedModulePrivilegeComponent implements OnInit {
  displayedColumns3: string[] = [
    'modulename', 'full_access',
    'create_access',
    'edit_access',
    'delete_access',
    'view_access',
    'print_access',
  ];
  search: string = '';
  dataSource3: any = [];
  loading: boolean = false;
  dataSource!: MatTableDataSource<any>;
  currentUser: any;
  module_id: any;
  role_id: any;

  // Master checkboxes
  allCreateChecked = false;
  allEditChecked = false;
  allDeleteChecked = false;
  allViewChecked = false;
  allPrintChecked = false;
  allFullAccessChecked = false;

  constructor(private manageModuleService: ManageModuleService, @Inject(MAT_DIALOG_DATA) public data: any, private cookieService: CookieService, public dialogRef: MatDialogRef<RelatedModulePrivilegeComponent>) { }

  ngOnInit(): void {
    debugger
    this.module_id = this.data.module_id;
    this.role_id = this.data.role_id;

    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');

    this.manageModuleService.getModuleFieldDetailsByParentModuleId(this.module_id).subscribe((Result1: any) => {
      console.log("Result1", Result1);

      this.manageModuleService.getModuleFieldWithprivilege(this.module_id, this.role_id).subscribe((Result2: any) => {
        console.log("Result2", Result2);

        const mergedResult = Result1 && Result1.map(moduleField => {
          let matchedPrivilege = Result2.data.find(priv =>  moduleField.module_id == priv.child_module_id);

          return {
            ...moduleField,
            full_access: matchedPrivilege?.full_access ?? false,
            create_access: matchedPrivilege?.create_access ?? false,
            edit_access: matchedPrivilege?.edit_access ?? false,
            delete_access: matchedPrivilege?.delete_access ?? false,
            view_access: matchedPrivilege?.view_access ?? false,
            print_access: matchedPrivilege?.print_access ?? false,
          };
        });

        console.log("Merged Result", mergedResult);

        // Do something with mergedResult (assign to variable, update UI, etc.)
        // this.mergedModuleFields = mergedResult;

        this.dataSource3 = new MatTableDataSource(mergedResult);

        const data = this.dataSource3.data;
        this.allFullAccessChecked = data.every(r => r.full_access);
        this.allCreateChecked = data.every(r => r.create_access);
        this.allEditChecked = data.every(r => r.edit_access);
        this.allDeleteChecked = data.every(r => r.delete_access);
        this.allViewChecked = data.every(r => r.view_access);
        this.allPrintChecked = data.every(r => r.print_access);

      });
    });

  }

  miscelleneosRulesSave() {
    debugger;

    this.loading = true;
    const enteredData = this.dataSource3.data;

    const obj1 = this.currentUser ? JSON.parse(this.currentUser) : "";
    var obj = {
      enteredData: enteredData,
      role_id: this.role_id,
      userid: obj1[0]?.login_id,
      parent_module_id: this.module_id
    }
    this.manageModuleService.miscelleneosRulesSave(obj).subscribe(
      (response: any) => {
        this.loading = false;
        this.success("Save Successfully");
        this.dialogRef.close('Success');
      })
  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
    this.loading = false;
  }

  // Toggle individual column
  toggleAll(field: string, isChecked: boolean) {
    debugger
    if (this.dataSource3?.data?.length) {
      this.dataSource3.data.forEach(item => {
        item[field] = isChecked;
      });
    }
  }

  // toggleRowAccess(field:string,element:any){debugger
  //   element.full_access =true
  //   this.dataSource3.data.every(row => row[field]);
  // }

  toggleRowAccess(field: string, element: any) {
    // No need to set full_access to true blindly
    // Instead, evaluate whether ALL access fields are checked
    const allAccessFieldsSelected = element.create_access &&
      element.edit_access &&
      element.delete_access &&
      element.view_access &&
      element.print_access;

    element.full_access = allAccessFieldsSelected;
  }


  // Toggle all fields for all rows
  toggleAllFullAccess(isChecked: boolean) {
    debugger
    if (this.dataSource3?.data?.length) {
      this.dataSource3.data.forEach(item => {
        item.full_access = isChecked;
        item.create_access = isChecked;
        item.edit_access = isChecked;
        item.delete_access = isChecked;
        item.view_access = isChecked;
        item.print_access = isChecked;
      });

    }
    if (isChecked) {
      this.allCreateChecked = true;
      this.allEditChecked = true;
      this.allDeleteChecked = true;
      this.allViewChecked = true;
      this.allPrintChecked = true;
      this.allFullAccessChecked = true;
    } else {
      this.allCreateChecked = false;
      this.allEditChecked = false;
      this.allDeleteChecked = false;
      this.allViewChecked = false;
      this.allPrintChecked = false;
      this.allFullAccessChecked = false;
    }

  }

  // Toggle all fields for a single row
  toggleRowFullAccess(row: any) {
    const isChecked = row.full_access;
    row.create_access = isChecked;
    row.edit_access = isChecked;
    row.delete_access = isChecked;
    row.view_access = isChecked;
    row.print_access = isChecked;
    this.allFullAccessChecked = this.dataSource3.data.every(row => row.full_access);
    if (this.allFullAccessChecked) {
      this.allCreateChecked = true;
      this.allEditChecked = true;
      this.allDeleteChecked = true;
      this.allViewChecked = true;
      this.allPrintChecked = true;
      this.allFullAccessChecked = true;
    } else {
      this.allCreateChecked = false;
      this.allEditChecked = false;
      this.allDeleteChecked = false;
      this.allViewChecked = false;
      this.allPrintChecked = false;
      this.allFullAccessChecked = false;
    }
  }

}
