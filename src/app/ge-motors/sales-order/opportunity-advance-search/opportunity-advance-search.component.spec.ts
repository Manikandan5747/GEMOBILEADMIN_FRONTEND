import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityAdvanceSearchComponent } from './opportunity-advance-search.component';

describe('OpportunityAdvanceSearchComponent', () => {
  let component: OpportunityAdvanceSearchComponent;
  let fixture: ComponentFixture<OpportunityAdvanceSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpportunityAdvanceSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityAdvanceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
