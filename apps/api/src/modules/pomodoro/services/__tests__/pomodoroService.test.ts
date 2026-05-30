/**
 * TODO: Implement unit tests for PomodoroService.
 *
 * Required test cases:
 *
 * 1. startPomodoroSession
 *    - Should create and return a new ACTIVE session when no active session exists.
 *    - Should throw ConflictError when an ACTIVE session already exists for the user.
 *
 * 2. stopPomodoroSession
 *    - Should mark the active session as COMPLETED and set endTime when an active session exists.
 *    - Should throw NotFoundError when no active session exists for the user.
 *
 * Testing approach:
 *    - Mock the shared `prisma` singleton from `src/lib/prisma.ts` using jest.mock.
 *    - Instantiate PomodoroService directly in each test.
 *
 * Example scaffold:
 *
 * import PomodoroService from '../pomodoroService';
 * import { prisma } from '../../../../lib/prisma';
 * import { ConflictError, NotFoundError } from '../../errors/pomodoroErrors';
 *
 * jest.mock('../../../../lib/prisma', () => ({
 *   prisma: {
 *     pomodoroSession: {
 *       findFirst: jest.fn(),
 *       create: jest.fn(),
 *       update: jest.fn(),
 *     },
 *   },
 * }));
 *
 * const mockPrisma = prisma as jest.Mocked<typeof prisma>;
 *
 * describe('PomodoroService', () => {
 *   let service: PomodoroService;
 *
 *   beforeEach(() => {
 *     jest.clearAllMocks();
 *     service = new PomodoroService();
 *   });
 *
 *   describe('startPomodoroSession', () => {
 *     it('should create a new session when no active session exists', async () => { ... });
 *     it('should throw ConflictError when an active session already exists', async () => { ... });
 *   });
 *
 *   describe('stopPomodoroSession', () => {
 *     it('should complete the active session', async () => { ... });
 *     it('should throw NotFoundError when no active session exists', async () => { ... });
 *   });
 * });
 */

export {};
