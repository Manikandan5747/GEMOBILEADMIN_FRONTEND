import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsignmentdirComponent } from './consignmentdir.component';

describe('ConsignmentdirComponent', () => {
  let component: ConsignmentdirComponent;
  let fixture: ComponentFixture<ConsignmentdirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsignmentdirComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsignmentdirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
