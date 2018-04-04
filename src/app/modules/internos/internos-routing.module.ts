import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InternosComponent } from './internos.component'

const routes: Routes = [
    {
        path: '',
        component: InternosComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InternosRoutingModule { }
