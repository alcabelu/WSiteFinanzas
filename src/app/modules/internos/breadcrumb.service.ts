import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BreadcrumbService {

  constructor() { }

  private breadcrumbList: IBreadcrumb[] = [];
  private breadcrumbSource = new Subject<IBreadcrumb[]>();
  breadcrumb$ = this.breadcrumbSource.asObservable();

  getBreadcrumbs() {
    this.breadcrumbSource.next(this.breadcrumbList);
  }

  addBreadcrumb(value: IBreadcrumb) {
    // Setear todos los valores de active a false, el nuevo viene activo
    if (this.breadcrumbList.length > 0) {
      this.breadcrumbList.forEach(bc => {
        bc.active = false;
      });
    }

    this.breadcrumbList.push(value);
  }

  updateBreadcrumbs(index: number) {
    const len = this.breadcrumbList.length;

    if (index === 1 && len === 1) {
      this.breadcrumbList = [];
      return;
    }

    const steps = len - index + 1;

    // Deja el ultimo como activo
    this.breadcrumbList[index].active = true;

    // Quita los elementos de la derecha a partir del index
    this.breadcrumbList.splice(index, steps);
  }
}

export interface IBreadcrumb {
  text: string;
  url: string;
  index: number;
  active: boolean;
}
