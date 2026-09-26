import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditShowroomCarDetailsFormComponent } from './add-edit-showroom-car-details-form.component';

describe('AddEditShowroomCarDetailsFormComponent', () => {
  let component: AddEditShowroomCarDetailsFormComponent;
  let fixture: ComponentFixture<AddEditShowroomCarDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditShowroomCarDetailsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditShowroomCarDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
