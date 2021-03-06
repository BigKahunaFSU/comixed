/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2017, The ComiXed Project
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

import {
  Injectable,
  EventEmitter,
} from '@angular/core';

@Injectable()
export class AlertService {
  error_messages: EventEmitter<string> = new EventEmitter();
  info_messages: EventEmitter<string> = new EventEmitter();

  constructor() { }

  show_info_message(message: string): void {
    this.info_messages.emit(message);
  }

  show_error_message(message: string, error: Error): void {
    this.error_messages.emit(message);
    console.log('ERROR:', message);
    if (error) {
      console.log('Context:', error);
    }
  }
}
