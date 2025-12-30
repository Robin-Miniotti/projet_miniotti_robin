import { TestBed } from '@angular/core/testing';

import { PollutionServiceService } from './pollution-service.service';

describe('PollutionServiceService', () => {
  let service: PollutionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PollutionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
