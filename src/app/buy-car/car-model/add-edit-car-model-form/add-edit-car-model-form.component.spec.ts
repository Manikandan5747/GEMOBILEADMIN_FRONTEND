import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCarModelFormComponent } from './add-edit-car-model-form.component';

describe('AddEditCarModelFormComponent', () => {
  let component: AddEditCarModelFormComponent;
  let fixture: ComponentFixture<AddEditCarModelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCarModelFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCarModelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
