import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDriveWindowComponent } from './test-drive-window.component';

describe('TestDriveWindowComponent', () => {
  let component: TestDriveWindowComponent;
  let fixture: ComponentFixture<TestDriveWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestDriveWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDriveWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
