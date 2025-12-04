
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';  
import { FeeBreakdown } from '../FeeBreakdown';
import type { BidCalculationResponse } from '../../types/bid';

const sampleData: BidCalculationResponse = {
  basePrice: 1000,
  vehicleType: 'Common',
  fees: [
    { name: 'Basic buyer fee', amount: 50 },
    { name: 'Seller special fee', amount: 20 },
  ],
  total: 1070,
};

describe('FeeBreakdown', () => {
  it('renders base price, vehicle type, fees and total', () => {
    render(<FeeBreakdown data={sampleData} />);

    expect(screen.getByText('Base Price')).toBeInTheDocument();
    expect(screen.getByText('Vehicle Type')).toBeInTheDocument();
    expect(screen.getByText('Common')).toBeInTheDocument();
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
    expect(screen.getByText('Basic buyer fee')).toBeInTheDocument();
    expect(screen.getByText('Seller special fee')).toBeInTheDocument();
    expect(screen.getByText('$1,070.00')).toBeInTheDocument();
  });
});
