import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceAdvisorComponent } from './service-advisor.component';

describe('ServiceAdvisorComponent', () => {
  let component: ServiceAdvisorComponent;
  let fixture: ComponentFixture<ServiceAdvisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceAdvisorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceAdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
