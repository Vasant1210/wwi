import { TestBed } from '@angular/core/testing';

import { WebcastService } from './webcast.service';

describe('WebcastService', () => {
  let service: WebcastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebcastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
