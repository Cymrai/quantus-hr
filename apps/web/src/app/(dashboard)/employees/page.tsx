export default function EmployeesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
        <button className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors">Add Employee</button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-gray-500 text-sm">No employees yet. Add your first team member to get started.</p>
      </div>
    </div>
  );
}
