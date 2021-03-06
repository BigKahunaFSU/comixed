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
  ComponentFixture,
  TestBed,
  async,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AlertService } from './services/alert.service';
import { UserService } from './services/user.service';
import { MockUserService } from './services/mock-user.service';
import {
  User,
  Role,
} from './models/user.model';
import { ComicService } from './services/comic.service';
import { MockComicService } from './services/mock-comic.service';
import { BusyIndicatorComponent } from './busy-indicator/busy-indicator.component';
import { LoadingModule } from 'ngx-loading';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let user_service: UserService;
  let alert_service: AlertService;
  let comic_service: ComicService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        LoadingModule
      ],
      declarations: [
        BusyIndicatorComponent,
        AppComponent
      ],
      providers: [
        AlertService,
        { provide: UserService, useClass: MockUserService },
        { provide: ComicService, useClass: MockComicService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    user_service = TestBed.get(UserService);
    alert_service = TestBed.get(AlertService);
    comic_service = TestBed.get(ComicService);
    router = TestBed.get(Router);

    fixture.detectChanges();
    router.initialNavigation();
  }));

  describe('Alerts', () => {
    it('should initialize as not shown', fakeAsync(() => {
      fixture.detectChanges();

      const alert_message = fixture.debugElement.query(By.css('div.alert'));

      expect(alert_message).toBe(null);
    }));

    it('alerts can be dismissed', fakeAsync(() => {
      const expected = 'This is an error message';

      alert_service.show_error_message(expected, null);
      component.ngAfterViewInit();

      fixture.detectChanges();
      tick();

      const dismiss_alert = fixture.debugElement.query(By.css('#alert-message-dismiss'));

      expect(dismiss_alert).not.toBe(null);

      dismiss_alert.triggerEventHandler('click', null);

      fixture.detectChanges();
      tick();

      expect(fixture.debugElement.query(By.css('div.alert'))).toBe(null);
    }));

    it('#clear_alert_message() removes the message at an index', fakeAsync(() => {
      component.alert_messages.push(['old message', '']);

      component.clear_alert_message(0);

      expect(component.alert_messages.length).toBe(0);
    }));

    it('#clear_info_message() removes the first message to match', fakeAsync(() => {
      const newMessage = 'new message';
      component.alert_messages.push(['old message', '']);
      component.alert_messages.push([newMessage, '']);
      component.alert_messages.push([newMessage, '']);

      component.clear_info_message(newMessage);

      expect(component.alert_messages.length).toBe(2);
    }));

    it('should show error alerts when an error message is received', fakeAsync(() => {
      const expected = 'This is an error message';

      alert_service.show_error_message(expected, null);
      component.ngAfterViewInit();

      fixture.detectChanges();

      tick();

      const alert_message = fixture.debugElement.query(By.css('div.alert'));

      expect(alert_message).not.toBe(null);
      expect(alert_message.nativeElement.textContent.trim()).toContain(expected);
      expect(fixture.debugElement.query(By.css('div.alert-danger'))).toBe(alert_message);
    }));

    it('should show alerts when an info message is received and remove after 5 seconds', fakeAsync(() => {
      const expected = 'This is an info message';

      alert_service.show_info_message(expected);
      component.ngAfterViewInit();

      fixture.detectChanges();

      tick();

      const alert_message = fixture.debugElement.query(By.css('div.alert'));

      expect(alert_message).not.toBe(null);
      expect(alert_message.nativeElement.textContent.trim()).toContain(expected);
      expect(fixture.debugElement.query(By.css('div.alert-info'))).toBe(alert_message);

      tick(5000); // wait for the timeout to end

      fixture.detectChanges();

      const alert_message_again = fixture.debugElement.query(By.css('div.alert'));

      expect(alert_message_again).toBe(null);
    }));
  });

  it('delegates to UserService when checking authentication', () => {
    spyOn(user_service, 'is_authenticated').and.returnValue(true);

    expect(component.is_authenticated()).toBe(true);

    expect(user_service.is_authenticated).toHaveBeenCalled();
  });

  describe('#is_admin()', () => {
    const user: User = new User();

    beforeEach(() => {
      user.name = 'reader';
      user.authenticated = true;
      user.roles = [new Role()];
    });

    it('returns false when the user is not logged in', () => {
      spyOn(user_service, 'is_authenticated').and.returnValue(false);

      expect(component.is_admin()).toBe(false);

      expect(user_service.is_authenticated).toHaveBeenCalled();
    });

    it('returns false when the user does not have the role ADMIN', () => {
      user.roles[0].name = 'READER';

      spyOn(user_service, 'is_authenticated').and.returnValue(true);
      spyOn(user_service, 'get_user').and.returnValue(user);

      expect(component.is_admin()).toBe(false);

      expect(user_service.is_authenticated).toHaveBeenCalled();
      expect(user_service.get_user).toHaveBeenCalled();
    });

    it('returns true when the user has the role ADMIN', fakeAsync(() => {
      user.roles[0].name = 'ADMIN';

      spyOn(user_service, 'is_authenticated').and.returnValue(true);
      spyOn(user_service, 'get_user').and.returnValue(user);

      expect(component.is_admin()).toBe(true);

      expect(user_service.is_authenticated).toHaveBeenCalled();
      expect(user_service.get_user).toHaveBeenCalled();
    }));

  });

});
