import { Component, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TripBalances } from '../../models/balances.model';
import { TripService } from '../../../trips/services/trip.service';
import { LoadState, withLoadState } from '../../../../shared/load-state';

@Component({
  selector: 'app-balances',
  imports: [CurrencyPipe, RouterLink, MatButtonModule],
  templateUrl: './balances.html',
  styleUrl: './balances.scss',
})
export class Balances {
  private tripService = inject(TripService);

  readonly id = input.required<string>();

  readonly initial: LoadState<TripBalances> = { status: 'loading' };

  state = toSignal(
    toObservable(this.id).pipe(switchMap((id) => withLoadState(this.tripService.getBalances(id)))),
    { initialValue: this.initial },
  );
}