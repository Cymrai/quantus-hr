import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DashboardMe from './me';
import { fetchDataMock } from '../../lib/apiMock'; // Assuming you have a mock for API calls

jest.mock('swr', () => ({
  useSWR: jest.fn((key) => {
    if (key === '/performance/scores/me') {
      return { data: fetchDataMock(), error: null };
    }
    return { data: null, error: new Error('Not found') };
  })
}));

describe('DashboardMe', () => {
  it('renders loading state initially', () => {
    render(<DashboardMe />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('displays the score and model type when data is fetched successfully', async () => {
    render(<DashboardMe />);
    await waitFor(() => expect(screen.getByText(/Model Score/i)).toBeInTheDocument());
  });

  it('handles error state gracefully', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console errors for testing
    render(<DashboardMe />);
    await waitFor(() => expect(screen.getByText(/Error fetching performance score/i)).toBeInTheDocument());
  });
});