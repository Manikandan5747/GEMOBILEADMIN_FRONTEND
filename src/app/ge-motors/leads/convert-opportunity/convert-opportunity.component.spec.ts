import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertOpportunityComponent } from './convert-opportunity.component';

describe('ConvertOpportunityComponent', () => {
  let component: ConvertOpportunityComponent;
  let fixture: ComponentFixture<ConvertOpportunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvertOpportunityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
