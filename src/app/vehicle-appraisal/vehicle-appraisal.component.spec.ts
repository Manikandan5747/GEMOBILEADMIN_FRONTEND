import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleAppraisalComponent } from './vehicle-appraisal.component';

describe('VehicleAppraisalComponent', () => {
  let component: VehicleAppraisalComponent;
  let fixture: ComponentFixture<VehicleAppraisalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleAppraisalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleAppraisalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
