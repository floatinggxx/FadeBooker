import React from 'react';
import BarberoDashboard from '@/features/barbero/ui/BarberoDashboard';
import ErrorBoundary from '@/components/ErrorBoundary';

const BarberDashboardPage: React.FC = () => {
    return (
        <ErrorBoundary>
            <BarberoDashboard />
        </ErrorBoundary>
    );
};

export default BarberDashboardPage;
