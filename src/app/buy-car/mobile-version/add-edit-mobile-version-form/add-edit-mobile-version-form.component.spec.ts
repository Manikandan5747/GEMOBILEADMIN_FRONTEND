import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMobileVersionFormComponent } from './add-edit-mobile-version-form.component';

describe('AddEditMobileVersionFormComponent', () => {
  let component: AddEditMobileVersionFormComponent;
  let fixture: ComponentFixture<AddEditMobileVersionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditMobileVersionFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditMobileVersionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
