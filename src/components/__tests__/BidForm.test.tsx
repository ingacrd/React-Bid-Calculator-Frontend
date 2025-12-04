
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BidForm } from '../BidForm';
import * as api from '../../api/client';

const mockResult = {
  basePrice: 1000,
  vehicleType: 'Common',
  fees: [],
  total: 1000,
};

describe('BidForm', () => {
  it('calls onCalculated when form is submitted', async () => {
    vi.spyOn(api, 'calculateBid').mockResolvedValueOnce(mockResult as any);

    const handleCalculated = vi.fn();
    render(<BidForm onCalculated={handleCalculated} />);

    const input = screen.getByRole('spinbutton');
    await userEvent.clear(input);
    await userEvent.type(input, '1000');

    const button = screen.getByRole('button', { name: /calculate/i });
    await userEvent.click(button);

    await waitFor(() => {
      expect(handleCalculated).toHaveBeenCalledWith(mockResult);
    });
  });
});
