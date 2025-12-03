import { useEffect, useMemo, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import type { BidCalculationResponse, VehicleType } from '../types/bid';
import { calculateBid } from '../api/client';

interface BidFormProps {
  onCalculated: (result: BidCalculationResponse) => void;
}

export const BidForm: React.FC<BidFormProps> = ({ onCalculated }) => {
  const [price, setPrice] = useState<number>(1000);
  const [vehicleType, setVehicleType] = useState<VehicleType>('Common');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  // Core calculation using arguments instead of capturing state
  const doCalculate = async (p: number, t: VehicleType, signal?: AbortSignal) => {
    if (!p || p < 1) {
      setError('Price must be at least 1.00');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await calculateBid(p, t, signal);
      onCalculated(res);
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        setError(err?.message ?? 'Unexpected error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Debounced function receives latest values as arguments
  const debouncedCalculate = useMemo(
    () =>
      debounce((p: number, t: VehicleType) => {
        // cancel previous request
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        void doCalculate(p, t, controller.signal);
      }, 300),
    [] // created once
  );

  // Auto-calc whenever price or vehicleType change
  useEffect(() => {
    debouncedCalculate(price, vehicleType);
    return () => {
      // don't cancel here, we just let the debounce run or be replaced
    };
  }, [price, vehicleType, debouncedCalculate]);

  // Initial calculation on mount
  useEffect(() => {
    debouncedCalculate(price, vehicleType);

    return () => {
      debouncedCalculate.cancel();
      if (abortRef.current) abortRef.current.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Manual calculation uses the latest values directly
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    await doCalculate(price, vehicleType, controller.signal);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Base price (USD)</label>
        <span className="text-xs text-slate-500">auto-calculates (debounced)</span>
      </div>
      <input
        type="number"
        min={1}
        step={0.01}
        value={price}
        onChange={(e) => setPrice(e.target.valueAsNumber)}
        className="w-full rounded-lg border px-3 py-2"
        placeholder="e.g. 1000"
        required
      />

      <div>
        <label className="block text-sm font-medium mb-1">Vehicle type</label>
        <select
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value as VehicleType)}
          className="w-full rounded-lg border px-3 py-2"
        >
          <option value="Common">Common</option>
          <option value="Luxury">Luxury</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
          // disabled={loading}
        >
          {/* {loading ? 'Calculating...' : 'Calculate'} */}
          Calculate
        </button>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {!error && loading && (
          <p className="text-slate-500 text-sm">Recalculating…</p>
        )}
      </div>
    </form>
  );
};
