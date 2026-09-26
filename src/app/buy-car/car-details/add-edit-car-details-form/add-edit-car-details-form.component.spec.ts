import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCarDetailsFormComponent } from './add-edit-car-details-form.component';

describe('AddEditCarDetailsFormComponent', () => {
  let component: AddEditCarDetailsFormComponent;
  let fixture: ComponentFixture<AddEditCarDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCarDetailsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCarDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
