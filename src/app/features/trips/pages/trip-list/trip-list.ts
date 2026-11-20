import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TripService } from '../../services/trip.service';
import { TripCard } from '../../components/trip-card/trip-card';
import { withLoadState } from '../../../../shared/load-state';

@Component({
  selector: 'app-trip-list',
  imports: [TripCard, RouterLink, MatButtonModule],
  templateUrl: './trip-list.html',
  styleUrl: './trip-list.scss',
})
export class TripList {
  private tripService = inject(TripService);

  state = toSignal(withLoadState(this.tripService.getTrips()), { requireSync: true });
}