/* QHR-35 */
/**
 * TODO (CRITICAL): Implement JWT authentication middleware and role-based
 * access control (RBAC) guards here.
 *
 * Requirements:
 * - Verify the Bearer token on every request using a shared JWT secret /
 *   public key (RS256 recommended for production).
 * - Decode the token and attach the user context (userId, role) to `req.user`.
 * - Define roles: EMPLOYEE, MANAGER, HR_ADMIN, FINANCE.
 * - Route-level guards:
 *     GET  /employees          → HR_ADMIN, FINANCE, MANAGER
 *     GET  /employees/:id      → HR_ADMIN, FINANCE, MANAGER (own record for EMPLOYEE)
 *     POST /employees          → HR_ADMIN
 *     PATCH /employees/:id     → HR_ADMIN
 *     DELETE /employees/:id    → HR_ADMIN
 * - Sensitive fields (salary) must only be included in responses for
 *   HR_ADMIN and FINANCE roles.  Other roles receive the PublicEmployeeDto
 *   (salary omitted).
 * - Return HTTP 401 for missing / invalid tokens.
 * - Return HTTP 403 for valid tokens with insufficient role.
 *
 * Example libraries: jsonwebtoken, express-jwt, passport-jwt.
 */

import { Request, Response, NextFunction } from 'express';

// Placeholder — MUST be replaced with a real JWT-based implementation.
export function authenticate(
  _req: Request,
  _res: Response,
  next: NextFunction,
): void {
  // TODO: Validate JWT, populate req.user, call next() or return 401.
  next();
}

// Placeholder RBAC guard factory.
export function requireRole(
  ..._roles: string[]
): (_req: Request, _res: Response, next: NextFunction) => void {
  return (_req, _res, next) => {
    // TODO: Check req.user.role against allowed roles; return 403 if not
    //       authorised.
    next();
  };
}
