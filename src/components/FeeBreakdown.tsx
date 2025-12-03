import type { BidCalculationResponse } from '../types/bid';

interface FeeBreakdownProps {
  data: BidCalculationResponse;
}

export const FeeBreakdown: React.FC<FeeBreakdownProps> = ({ data }) => {
  const money = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  return (
    <section className="bg-white shadow rounded-xl p-5">
      <h2 className="text-xl font-semibold mb-4">Result</h2>

      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
        <div className="text-slate-500">Base Price</div>
        <div className="text-right font-medium">{money(data.basePrice)}</div>

        <div className="text-slate-500">Vehicle Type</div>
        <div className="text-right font-medium">{data.vehicleType}</div>
      </div>

      <div className="border-t border-slate-200 my-3" />

      <ul className="space-y-1 text-sm">
        {data.fees.map((f) => (
          <li key={f.name} className="flex justify-between">
            <span>{f.name}</span>
            <span>{money(f.amount)}</span>
          </li>
        ))}
      </ul>

      <div className="border-t border-slate-200 my-3" />

      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>{money(data.total)}</span>
      </div>
    </section>
  );
};
