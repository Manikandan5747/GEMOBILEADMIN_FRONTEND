import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditExpenseFormComponent } from './add-edit-expense-form.component';

describe('AddEditExpenseFormComponent', () => {
  let component: AddEditExpenseFormComponent;
  let fixture: ComponentFixture<AddEditExpenseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditExpenseFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditExpenseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
