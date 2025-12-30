import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollutionUpdateFormComponent } from './pollution-update-form.component';

describe('PollutionUpdateFormComponent', () => {
  let component: PollutionUpdateFormComponent;
  let fixture: ComponentFixture<PollutionUpdateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollutionUpdateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollutionUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
