import { useState } from 'react';
import type { BidCalculationResponse } from '../types/bid';
import { BidForm } from '../components/BidForm';
import { FeeBreakdown } from '../components/FeeBreakdown';

export const BidCalculatorPage: React.FC = () => {
  const [result, setResult] = useState<BidCalculationResponse | null>(null);

  return (
    <div className="space-y-4">
      <BidForm onCalculated={setResult} />
      {result && <FeeBreakdown data={result} />}
    </div>
  );
};
