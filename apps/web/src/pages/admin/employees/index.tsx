import { GetServerSideProps, NextPage } from 'next';
import axios, { AxiosError } from 'axios';
import { jwtVerify } from 'jose';
import React from 'react';
import Link from 'next/link';
import { Employee } from '../../../types/employee';

const API_BASE_URL = process.env.API_BASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;

interface Props {
  employees: Employee[];
  page: number;
  totalPages: number;
}

const EmployeesListPage: NextPage<Props> = ({ employees, page, totalPages }) => {
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
              <td className="border px-4 py-2">
                <Link href={`/admin/employees/${employee.id}`}>
                  {employee.name}
                </Link>
              </td>
              <td className="border px-4 py-2">{employee.jobTitle}</td>
              <td className="border px-4 py-2">{employee.department}</td>
              <td className="border px-4 py-2">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {employee.modelBadge}
                </span>
              </td>
              <td className="border px-4 py-2">{employee.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex gap-2 items-center">
        {page > 1 && (
          <a href={`/admin/employees?page=${page - 1}`} className="px-3 py-1 border rounded">
            Previous
          </a>
        )}
        <span>Page {page} of {totalPages}</span>
        {page < totalPages && (
          <a href={`/admin/employees?page=${page + 1}`} className="px-3 py-1 border rounded">
            Next
          </a>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const token = req.cookies?.jwt;
  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  if (!JWT_SECRET) {
    console.error('JWT_SECRET environment variable is not set.');
    return {
      redirect: {
        destination: '/error',
        permanent: false,
      },
    };
  }

  let verifiedPayload: { role?: string };
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    verifiedPayload = payload as { role?: string };
  } catch {
    // Token is invalid or expired
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  if (verifiedPayload.role !== 'admin') {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  const page = parseInt((query.page as string) ?? '1', 10) || 1;
  const limit = 50;

  try {
    const response = await axios.get(`${API_BASE_URL}/employees`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { page, limit },
    });

    const totalPages: number = response.data.totalPages ?? 1;

    return {
      props: {
        employees: response.data.data ?? response.data,
        page,
        totalPages,
      },
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 404) {
      return { notFound: true };
    }
    console.error('Error fetching employees data:', error);
    return {
      redirect: {
        destination: '/error',
        permanent: false,
      },
    };
  }
};

export default EmployeesListPage;
