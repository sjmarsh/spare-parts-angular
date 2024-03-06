import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { AuthorizationService } from '../services/authorization-service';
import UserRoles from '../../../constants/userRoles';

export const inventoryGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthorizationService);
  const userIsAuthorized = authService.userIsLoggedIn() && authService.userHasRequiredRoles([UserRoles.Administrator, UserRoles.StocktakeUser]);
  return userIsAuthorized;
};
