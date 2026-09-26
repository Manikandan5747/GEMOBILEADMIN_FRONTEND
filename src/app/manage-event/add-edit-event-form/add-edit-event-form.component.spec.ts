import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEventFormComponent } from './add-edit-event-form.component';

describe('AddEditEventFormComponent', () => {
  let component: AddEditEventFormComponent;
  let fixture: ComponentFixture<AddEditEventFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditEventFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditEventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
