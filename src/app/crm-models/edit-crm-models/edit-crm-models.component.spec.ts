import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCrmModelsComponent } from './edit-crm-models.component';

describe('EditCrmModelsComponent', () => {
  let component: EditCrmModelsComponent;
  let fixture: ComponentFixture<EditCrmModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCrmModelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCrmModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
