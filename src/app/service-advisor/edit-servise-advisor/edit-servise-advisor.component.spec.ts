import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditServiseAdvisorComponent } from './edit-servise-advisor.component';

describe('EditServiseAdvisorComponent', () => {
  let component: EditServiseAdvisorComponent;
  let fixture: ComponentFixture<EditServiseAdvisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditServiseAdvisorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditServiseAdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
