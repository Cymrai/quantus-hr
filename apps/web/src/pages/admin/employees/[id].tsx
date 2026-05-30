import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import axios, { AxiosError } from 'axios';
import { jwtVerify } from 'jose';
import { Employee } from '../../../types/employee';

const API_BASE_URL = process.env.API_BASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;

interface Props {
  employee: Employee;
}

const EmployeeDetailPage: NextPage<Props> = ({ employee }) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{employee.name}</h1>
      <p>{employee.jobTitle}</p>
      <p>{employee.department}</p>
      <p>
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
          {employee.modelBadge}
        </span>
      </p>
      <p>{employee.status}</p>
      {/* Placeholder for performance score section */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Performance Score</h2>
        <p>Score data will be displayed here once available.</p>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
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

  try {
    const response = await axios.get(`${API_BASE_URL}/employees/${params?.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      props: {
        employee: response.data,
      },
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 404) {
      return { notFound: true };
    }
    console.error('Error fetching employee data:', error);
    return {
      redirect: {
        destination: '/error',
        permanent: false,
      },
    };
  }
};

export default EmployeeDetailPage;
