import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

  constructor() { }

  // Convierte mes numerico a nombre del mes
  toLongMonth(mes: string): string {
    if (mes !== '') {
      const objDate = new Date(mes + '/01/2000'),
        locale = 'es-mx',
        month = objDate.toLocaleString(locale, { month: 'long' });
      return month;
    } else {
      return '';
    }
  }
}
