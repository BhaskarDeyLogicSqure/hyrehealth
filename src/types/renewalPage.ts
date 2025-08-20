export interface PlanOption {
  id?: string;
  _id?: string;
  duration: {
    value: number;
    unit: string;
  };
  price: number;
  title: string;
  originalPrice?: number;
  savings?: number;
  badge?: string;
}
