import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowroomCarDetailsComponent } from './showroom-car-details.component';

describe('ShowroomCarDetailsComponent', () => {
  let component: ShowroomCarDetailsComponent;
  let fixture: ComponentFixture<ShowroomCarDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowroomCarDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowroomCarDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
