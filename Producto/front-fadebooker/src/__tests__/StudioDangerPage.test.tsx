import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import StudioDangerPage from '@/pages/StudioDangerPage';

describe('StudioDangerPage', () => {
  it('renders the StudioDanger hero and schedule details', () => {
    render(
      <MemoryRouter>
        <StudioDangerPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /StudioDanger/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Av\. Las Torres 152/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/09:00 - 19:00/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: /Ver disponibilidad/i })).toBeInTheDocument();
  });
});
