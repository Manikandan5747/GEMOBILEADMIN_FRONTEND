import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditShowroomContactDetailsFormComponent } from './add-edit-showroom-contact-details-form.component';

describe('AddEditShowroomContactDetailsFormComponent', () => {
  let component: AddEditShowroomContactDetailsFormComponent;
  let fixture: ComponentFixture<AddEditShowroomContactDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditShowroomContactDetailsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditShowroomContactDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
