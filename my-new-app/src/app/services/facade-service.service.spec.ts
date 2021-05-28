import { TestBed } from '@angular/core/testing';

import { FacadeServiceService } from './facade-service.service';

describe('FacadeServiceService', () => {
  let service: FacadeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacadeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
