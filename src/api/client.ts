import type { BidCalculationResponse, VehicleType } from '../types/bid';

const API_URL = import.meta.env.VITE_API_URL as string | undefined;

if (!API_URL) {
  console.warn('VITE_API_URL is not set. API calls will fail.');
}

export async function calculateBid(
  basePrice: number,
  vehicleType: VehicleType,
  signal?: AbortSignal
): Promise<BidCalculationResponse> {
  if (!API_URL) {
    throw new Error('API URL is not configured (VITE_API_URL).');
  }

  const url = new URL('/api/bid/calculate', API_URL);
  url.searchParams.set('basePrice', basePrice.toString());
  url.searchParams.set('vehicleType', vehicleType);

  const response = await fetch(url.toString(), { method: 'GET', signal });

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    const text = await response.text();
    throw new Error(`API did not return JSON. Body: ${text}`);
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API ${response.status}: ${text}`);
  }

  return response.json() as Promise<BidCalculationResponse>;
}
