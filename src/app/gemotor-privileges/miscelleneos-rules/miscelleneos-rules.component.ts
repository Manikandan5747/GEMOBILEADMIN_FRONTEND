import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CookieService } from 'src/app/service/cookie.service';
import { ManageModuleService } from 'src/app/service/manage-module/manage-module.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-miscelleneos-rules',
  templateUrl: './miscelleneos-rules.component.html',
  styleUrls: ['./miscelleneos-rules.component.css']
})


export class MiscelleneosRulesComponent implements OnInit {
  position: any = 'before';
  permissionList: any = [];
  login_id: any = [];
  selectedPermissions: any[] = [];
  module_id: any;
  role_id: any;
  miscPrivilegesList: any = [];
  getpermissionList: any = [];
  constructor(private manageModuleService: ManageModuleService, @Inject(MAT_DIALOG_DATA) public data: any, private cookieService: CookieService, public dialogRef: MatDialogRef<MiscelleneosRulesComponent>) { }

  ngOnInit(): void {
    this.module_id = this.data.module_id;
    this.role_id = this.data.role_id;
    this.login_id = this.data.login_id;
    if (this.module_id) {
      this.manageModuleService.miscMapping(this.module_id).subscribe((mappingData: any[]) => {

        this.getpermissionList = mappingData.filter(item => item.status === 1);
        const payload = {
          module_id: this.module_id,
          role_id: this.role_id
        };

        // Step 2: Load existing privileges
        this.manageModuleService.getMiscPrivilegesById(payload).subscribe((privilegeData: any[]) => {
          this.miscPrivilegesList = privilegeData;
          // Step 3: Match and update permissionList with saved privileges
          this.permissionList = this.getpermissionList.map(permission => {

            let match = this.miscPrivilegesList.find(p =>
              p.module_id === this.module_id && p.misc_id == permission.misc_id
            );

            if (match) {
              return {
                ...permission,
                selected: match.access || false,
                access: match.access || false,
                misc_privilege_id: match.misc_privilege_id
              };
            }

            return permission;
          });
        });
      });
    }


  }

  update() {debugger
    var obj = {
      miscItems: this.permissionList,
      role_id: this.role_id,
      module_id: this.module_id,
      created_by: this.login_id
    }
    this.manageModuleService.createorupdatemiscprivileges(obj).subscribe(
      (response: any) => {
        this.success("Save Successfully");
         this.dialogRef.close('Success');
      })

  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

}
