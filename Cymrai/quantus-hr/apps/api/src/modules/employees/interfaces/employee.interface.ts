// [MAJOR] Concrete Employee interface replacing pervasive `any` usage.
// Align field names/types with your Prisma schema as needed.
export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}
