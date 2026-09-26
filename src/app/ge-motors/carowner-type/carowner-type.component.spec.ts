import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarownerTypeComponent } from './carowner-type.component';

describe('CarownerTypeComponent', () => {
  let component: CarownerTypeComponent;
  let fixture: ComponentFixture<CarownerTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarownerTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarownerTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
