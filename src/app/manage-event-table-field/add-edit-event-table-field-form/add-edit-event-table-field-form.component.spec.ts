import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEventTableFieldFormComponent } from './add-edit-event-table-field-form.component';

describe('AddEditEventTableFieldFormComponent', () => {
  let component: AddEditEventTableFieldFormComponent;
  let fixture: ComponentFixture<AddEditEventTableFieldFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditEventTableFieldFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditEventTableFieldFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
