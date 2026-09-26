import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditInternalAppVersionComponent } from './add-edit-internal-app-version.component';

describe('AddEditInternalAppVersionComponent', () => {
  let component: AddEditInternalAppVersionComponent;
  let fixture: ComponentFixture<AddEditInternalAppVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditInternalAppVersionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditInternalAppVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
