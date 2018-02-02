import { Component, OnInit } from '@angular/core';
import { BreadcrumbService, IBreadcrumb } from './breadcrumb.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './int-unidades-nv3.component.html',
  styleUrls: ['./int-unidades-nv3.component.scss']
})
export class IntUnidadesNv3Component implements OnInit {
  breadcrumbs: IBreadcrumb[] = [];

  constructor(private _breadcrumbService: BreadcrumbService, private _router: Router) { }

  ngOnInit() {
        // Breadcrumbs
        this._breadcrumbService.breadcrumb$.subscribe(
          bc => {
            this.breadcrumbs = bc;
          }
        );
        this._breadcrumbService.getBreadcrumbs();
  }

  breadcrumbsRouting(breadcrumb: IBreadcrumb) {
    this._breadcrumbService.updateBreadcrumbs(breadcrumb.index);
    this._router.navigateByUrl(breadcrumb.url);
  }

}
