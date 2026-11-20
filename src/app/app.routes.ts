import { Routes } from '@angular/router';
import { TripList } from './features/trips/pages/trip-list/trip-list';
import { TripDetails } from './features/trips/pages/trip-details/trip-details';
import { TripForm } from './features/trips/pages/trip-form/trip-form';

export const routes: Routes = [
  { path: '', redirectTo: 'trips', pathMatch: 'full' },
  { path: 'trips', component: TripList },
  { path: 'trips/new', component: TripForm },
  { path: 'trips/:id', component: TripDetails },

];