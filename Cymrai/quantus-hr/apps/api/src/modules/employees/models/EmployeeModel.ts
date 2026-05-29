/* QHR-38 */
import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  name: string;
  email: string;
  position: string;
  salary: number;
}

const EmployeeSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  position: { type: String, required: true },
  salary: { type: Number, required: true }
});

export const EmployeeModel = mongoose.model<IEmployee>('Employee', EmployeeSchema);