import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { EventService } from 'src/app/service/event/event.service';

@Component({
  selector: 'app-add-edit-event-table-form',
  templateUrl: './add-edit-event-table-form.component.html',
  styleUrls: ['./add-edit-event-table-form.component.css']
})
export class AddEditEventTableFormComponent implements OnInit {

  @Input() action!: any;
  @Input() isShowErrors!: boolean;
  @Input() table_id!: any;

  public matcher = new ErrorMatcherService();
  errors = errorMessages;

  public addEditForm!: FormGroup;

  mainTableList: any[] = [];
  filteredTableList!: Observable<any[]>;

  constructor(private fb: FormBuilder, private EventService: EventService) { }

  ngOnInit() {
    this.addEditForm = this.fb.group({
      table_name: ['', [Validators.required, this.tableValidator.bind(this)]],
      status: ['1']
    });

    this.loadEventTables();

    if (this.table_id) {
      this.addEditForm.patchValue({
        table_name: this.table_id
      });
    }

    this.filteredTableList = this.addEditForm.controls['table_name'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  get f() {
    return this.addEditForm.controls;
  }

  loadEventTables() {
    this.EventService.getEventsTables().subscribe((res: any) => {
      this.mainTableList = res.records || [];
      const currentValue = this.addEditForm.get('table_name')?.value || '';
      this.addEditForm.get('table_name')?.setValue(currentValue);
    });
  }

  private _filter(value: string | any): any[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value;
    return this.mainTableList.filter(option => option.sModuleName.toLowerCase().includes(filterValue));
  }

  tableValidator(control: FormControl) {
    if (!control.value) return null; 
    const isValid = this.mainTableList.some(option => option.sModuleName === control.value);
    return isValid ? null : { invalid: true };
  }

  displayFn(value: string): string {
    return value ? value : '';
  }

  validateTableName() {
    this.addEditForm.get('table_name')?.updateValueAndValidity();
  }
}
