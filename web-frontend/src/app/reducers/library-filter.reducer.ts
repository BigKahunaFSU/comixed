/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2018, The ComiXed Project
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.package
 * org.comixed;
 */

import { Action } from '@ngrx/store';
import { LibraryFilter } from '../models/library/library-filter';
import * as FilterActions from '../actions/library-filter.actions';

const initial_state: LibraryFilter = {
  changed: false,
  publisher: '',
  series: '',
  volume: '',
  from_year: null,
  to_year: null,
};

export function libraryFilterReducer(
  state: LibraryFilter = initial_state,
  action: FilterActions.Actions,
) {
  switch (action.type) {
    case FilterActions.LIBRARY_FILTER_RESET:
      return {
        changed: true,
        publisher: '',
        series: '',
        volume: '',
        from_year: null,
        to_year: null,
      };

    case FilterActions.LIBRARY_FILTER_SET_FILTERS:
      return {
        ...state,
        changed: true,
        publisher: action.payload.publisher,
        series: action.payload.series,
        volume: action.payload.volume,
        from_year: action.payload.from_year,
        to_year: action.payload.to_year,
      };

    default:
      return initial_state;
  }
}

