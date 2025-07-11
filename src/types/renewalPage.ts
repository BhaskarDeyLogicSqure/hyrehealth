export interface PlanOption {
  id: string;
  duration: number;
  price: number;
  title: string;
  originalPrice?: number;
  savings?: number;
  badge?: string;
}
