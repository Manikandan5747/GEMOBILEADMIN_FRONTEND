import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscelleneosRulesComponent } from './miscelleneos-rules.component';

describe('MiscelleneosRulesComponent', () => {
  let component: MiscelleneosRulesComponent;
  let fixture: ComponentFixture<MiscelleneosRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiscelleneosRulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscelleneosRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
