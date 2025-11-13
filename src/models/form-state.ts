/**
 * Object that holds the state of the campaign creation form
 */
export interface FormState {
  name?: string;
  objective?: string;
  priority?: 'low' | 'normal' | 'high';
  budget?: number;
  startDate?: string;
  endDate?: string;
  advertiser?: string;
  advertiserCategory?: string;
  creatives?: string[];
  products?: string[];
  demography?: string[];
  audience?: string[];
  geo?: string[];
  dayParting?: string[];
} 
