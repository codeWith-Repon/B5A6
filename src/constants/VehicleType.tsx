export const vehicleTypes = [
  'CAR',
  'BIKE',
  'CNG',
  'MINIVAN',
  'PREMIUM',
  'EV',
] as const;

export type VehicleType = (typeof vehicleTypes)[number];

export const vehicleTypeOptions: { label: string; value: VehicleType }[] = [
  { label: 'Car', value: 'CAR' },
  { label: 'Bike', value: 'BIKE' },
  { label: 'CNG', value: 'CNG' },
  { label: 'Minivan', value: 'MINIVAN' },
  { label: 'Premium', value: 'PREMIUM' },
  { label: 'EV', value: 'EV' },
];
