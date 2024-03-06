import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { partListGuard } from './part-list.guard';

describe('partListGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => partListGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
