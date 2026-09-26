import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentCarFormComponent } from './rent-car-form.component';

describe('RentCarFormComponent', () => {
  let component: RentCarFormComponent;
  let fixture: ComponentFixture<RentCarFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentCarFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentCarFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
