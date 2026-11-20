// What the API sends back
export interface Trip {
  _id: string;
  name: string;
  destination?: string;
  currency: string;
  startDate: string; 
  endDate: string;
}

// What is sent for POST (no _id)
export interface CreateTripDto {
  name: string;
  destination?: string;
  currency: string;
  startDate: string; // we send e.g. "2026-07-01"
  endDate: string;
}

// What is sent for PUT 
export interface UpdateTripDto {
  name: string;
  destination?: string;
  currency: string;
  startDate: string;
  endDate: string;
}