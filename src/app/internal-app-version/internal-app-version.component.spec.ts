import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalAppVersionComponent } from './internal-app-version.component';

describe('InternalAppVersionComponent', () => {
  let component: InternalAppVersionComponent;
  let fixture: ComponentFixture<InternalAppVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalAppVersionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalAppVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
