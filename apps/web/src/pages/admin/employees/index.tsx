import { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React from 'react';
import Link from 'next/link';

interface Employee {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  modelBadge: string;
  status: string;
}

interface Props {
  employees: Employee[];
}

const EmployeesListPage: NextPage<Props> = ({ employees }) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Employees List</h1>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Job Title</th>
            <th className="px-4 py-2 text-left">Department</th>
            <th className="px-4 py-2 text-left">Model Badge</th>
            <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td className="border px-4 py-2">{employee.name}</td>
              <td className="border px-4 py-2">{employee.jobTitle}</td>
              <td className="border px-4 py-2">{employee.department}</td>
              <td className="border px-4 py-2">{employee.modelBadge}</td>
              <td className="border px-4 py-2">{employee.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies?.jwt;
  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const decodedToken: { tenantId: string } = jwtDecode(token);
    const response = await axios.get('https://api.quantushr.com/v1/employees', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.some((employee: Employee) => employee.tenantId !== decodedToken.tenantId)) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      };
    }

    return {
      props: {
        employees: response.data,
      },
    };
  } catch (error) {
    console.error('Error fetching employees data:', error);
    return {
      notFound: true,
    };
  }
};

export default EmployeesListPage;