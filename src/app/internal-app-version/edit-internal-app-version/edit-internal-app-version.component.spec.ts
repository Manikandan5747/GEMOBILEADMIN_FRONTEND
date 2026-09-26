import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInternalAppVersionComponent } from './edit-internal-app-version.component';

describe('EditInternalAppVersionComponent', () => {
  let component: EditInternalAppVersionComponent;
  let fixture: ComponentFixture<EditInternalAppVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditInternalAppVersionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInternalAppVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
