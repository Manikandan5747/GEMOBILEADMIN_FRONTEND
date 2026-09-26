import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEventTableFormComponent } from './add-edit-event-table-form.component';

describe('AddEditEventTableFormComponent', () => {
  let component: AddEditEventTableFormComponent;
  let fixture: ComponentFixture<AddEditEventTableFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditEventTableFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditEventTableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
