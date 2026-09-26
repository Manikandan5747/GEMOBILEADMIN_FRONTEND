import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditUserRoleFormComponent } from './add-edit-user-role-form.component';

describe('AddEditUserRoleFormComponent', () => {
  let component: AddEditUserRoleFormComponent;
  let fixture: ComponentFixture<AddEditUserRoleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditUserRoleFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditUserRoleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
