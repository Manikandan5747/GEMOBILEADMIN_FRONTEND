import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesTextAreaComponent } from './des-text-area.component';

describe('DesTextAreaComponent', () => {
  let component: DesTextAreaComponent;
  let fixture: ComponentFixture<DesTextAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesTextAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesTextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
