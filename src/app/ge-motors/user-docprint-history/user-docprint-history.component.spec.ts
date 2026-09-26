import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDocprintHistoryComponent } from './user-docprint-history.component';

describe('UserDocprintHistoryComponent', () => {
  let component: UserDocprintHistoryComponent;
  let fixture: ComponentFixture<UserDocprintHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDocprintHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDocprintHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
