import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCustomerFormComponent } from './add-edit-customer-form.component';

describe('AddEditCustomerFormComponent', () => {
  let component: AddEditCustomerFormComponent;
  let fixture: ComponentFixture<AddEditCustomerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditCustomerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCustomerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
