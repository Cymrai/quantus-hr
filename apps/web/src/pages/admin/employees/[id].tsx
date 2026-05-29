import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

interface EmployeeProfile {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  modelBadge: string;
  status: string;
  // Add other fields as necessary
}

interface Props {
  employee: EmployeeProfile;
}

const EmployeeDetailPage: NextPage<Props> = ({ employee }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{employee.name}</h1>
      <p>{employee.jobTitle}</p>
      <p>{employee.department}</p>
      <p>{employee.modelBadge}</p>
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

  try {
    const decodedToken: { tenantId: string } = jwtDecode(token);
    const response = await axios.get(`https://api.quantushr.com/v1/employees/${params?.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.tenantId !== decodedToken.tenantId) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      };
    }

    return {
      props: {
        employee: response.data,
      },
    };
  } catch (error) {
    console.error('Error fetching employee data:', error);
    return {
      notFound: true,
    };
  }
};

export default EmployeeDetailPage;