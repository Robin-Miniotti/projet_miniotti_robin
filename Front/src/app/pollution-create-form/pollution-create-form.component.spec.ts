import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollutionCreateFormComponent } from './pollution-create-form.component';

describe('PollutionCreateFormComponent', () => {
  let component: PollutionCreateFormComponent;
  let fixture: ComponentFixture<PollutionCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollutionCreateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollutionCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
