import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditManageModuleFormComponent } from './add-edit-manage-module-form.component';

describe('AddEditManageModuleFormComponent', () => {
  let component: AddEditManageModuleFormComponent;
  let fixture: ComponentFixture<AddEditManageModuleFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditManageModuleFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditManageModuleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
