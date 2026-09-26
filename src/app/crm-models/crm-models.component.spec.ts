import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmModelsComponent } from './crm-models.component';

describe('CrmModelsComponent', () => {
  let component: CrmModelsComponent;
  let fixture: ComponentFixture<CrmModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmModelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
