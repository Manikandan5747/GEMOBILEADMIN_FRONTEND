import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenActivityComponent } from './open-activity.component';

describe('OpenActivityComponent', () => {
  let component: OpenActivityComponent;
  let fixture: ComponentFixture<OpenActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
