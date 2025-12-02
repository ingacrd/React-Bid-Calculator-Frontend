export type VehicleType = 'Common' | 'Luxury';

export interface FeeDto {
  name: string;
  amount: number;
}

export interface BidCalculationResponse {
  basePrice: number;
  vehicleType: VehicleType;
  fees: FeeDto[];
  total: number;
}
