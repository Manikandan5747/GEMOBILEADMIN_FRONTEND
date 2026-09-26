import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCarownerTypeFormComponent } from './add-edit-carowner-type-form.component';

describe('AddEditCarownerTypeFormComponent', () => {
  let component: AddEditCarownerTypeFormComponent;
  let fixture: ComponentFixture<AddEditCarownerTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCarownerTypeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCarownerTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
