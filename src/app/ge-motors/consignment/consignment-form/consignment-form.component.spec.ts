import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsignmentFormComponent } from './consignment-form.component';

describe('ConsignmentFormComponent', () => {
  let component: ConsignmentFormComponent;
  let fixture: ComponentFixture<ConsignmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsignmentFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsignmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
