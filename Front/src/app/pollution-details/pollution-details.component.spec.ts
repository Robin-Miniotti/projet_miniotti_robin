import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollutionDetailsComponent } from './pollution-details.component';

describe('PollutionDetailsComponent', () => {
  let component: PollutionDetailsComponent;
  let fixture: ComponentFixture<PollutionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollutionDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollutionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
