import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GemotordashboardComponent } from './gemotordashboard.component';

describe('GemotordashboardComponent', () => {
  let component: GemotordashboardComponent;
  let fixture: ComponentFixture<GemotordashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GemotordashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GemotordashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
