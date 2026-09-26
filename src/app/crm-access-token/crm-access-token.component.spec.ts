import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmAccessTokenComponent } from './crm-access-token.component';

describe('CrmAccessTokenComponent', () => {
  let component: CrmAccessTokenComponent;
  let fixture: ComponentFixture<CrmAccessTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmAccessTokenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmAccessTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
