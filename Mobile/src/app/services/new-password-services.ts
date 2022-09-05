import { IService } from './IService';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from './app-settings';
import { LoadingService } from './loading-service';

@Injectable()
export class NewPasswordService implements IService {

  constructor(public af: AngularFireDatabase, private loadingService: LoadingService) { }

  getTitle = (): string => 'Old/New Passworsd pages';

  getAllThemes = (): Array<any> => {
    return [
      { 'url': 'new-password/0', 'title': 'New Password Simple', 'theme': 'layout1' },
      { 'url': 'new-password/1', 'title': 'New Password With Image', 'theme': 'layout2' }
    ];
  }

  getDataForTheme = (menuItem: any): Array<any> => {
    return this[
      'getDataFor' +
      menuItem.theme.charAt(0).toUpperCase() +
      menuItem.theme.slice(1)
    ]();
  }

  //* Data Set for page 1
  getDataForLayout1 = (): any => {
    return {
      'toolbarTitle': 'New Password Simple',
      'title': 'Reset Your Password',
      'subtitle': 'Welcome',
      'labelPassword': 'PASSWORD',
      'password': 'New password',
      'labelPasswordNew': 'CONFRIM',
      'confrim': 'Confirm password',
      'done': 'Done',
      'logo': 'assets/imgs/logo/2.png',
      'errorIcon': 'remove-circle'
    };
  }

  //* Data Set for page 2
  getDataForLayout2 = (): any => {
    return {
      'toolbarTitle': 'New Password With Image',
      'background': 'assets/imgs/background/2.jpg',
      'title': 'Reset Your Password',
      'labelPassword': 'PASSWORD',
      'password': 'New password',
      'labelPasswordNew': 'CONFRIM',
      'confrim': 'Confirm password',
      'done': 'Done',
      'errorIcon': 'remove-circle'
    };
  }

  load(item: any): Observable<any> {
    this.loadingService.show();
    if (AppSettings.IS_FIREBASE_ENABLED) {
      return new Observable(observer => {
        this.af
          .object('newPassword/' + item.theme)
          .valueChanges()
          .subscribe(snapshot => {
            this.loadingService.hide();
            observer.next(snapshot);
            observer.complete();
          }, err => {
            this.loadingService.hide();
            observer.error([]);
            observer.complete();
          });
      });
    } else {
      return new Observable(observer => {
        this.loadingService.hide();
        observer.next(this.getDataForTheme(item));
        observer.complete();
      });
    }
  }
}
