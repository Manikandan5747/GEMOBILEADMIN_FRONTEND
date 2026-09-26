import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowroomdashboardComponent } from './showroomdashboard.component';

describe('ShowroomdashboardComponent', () => {
  let component: ShowroomdashboardComponent;
  let fixture: ComponentFixture<ShowroomdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowroomdashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowroomdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
