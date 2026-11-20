import { Component, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Trip } from '../../models/trip.model';
import { TripService } from '../../services/trip.service';
import { LoadState, withLoadState } from '../../../../shared/load-state';

@Component({
  selector: 'app-trip-details',
  imports: [DatePipe, RouterLink, MatButtonModule],
  templateUrl: './trip-details.html',
  styleUrl: './trip-details.scss',
})
export class TripDetails {
  private tripService = inject(TripService);

  // Filled from the :id in the URL (withComponentInputBinding)
  readonly id = input.required<string>();

  readonly initial: LoadState<Trip> = { status: 'loading' };

  state = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) => withLoadState(this.tripService.getTripById(id))),
    ),
    { initialValue: this.initial },
  );
}