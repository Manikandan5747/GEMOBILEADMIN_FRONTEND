import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBrandFormComponent } from './add-edit-brand-form.component';

describe('AddEditBrandFormComponent', () => {
  let component: AddEditBrandFormComponent;
  let fixture: ComponentFixture<AddEditBrandFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditBrandFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditBrandFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
