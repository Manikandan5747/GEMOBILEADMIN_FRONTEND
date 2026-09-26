import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPaginationComponent } from './report-pagination.component';

describe('ReportPaginationComponent', () => {
  let component: ReportPaginationComponent;
  let fixture: ComponentFixture<ReportPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportPaginationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
