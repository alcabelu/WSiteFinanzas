import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortableColumnComponent } from './sortable-column.component';
import { SortableTableDirective } from './sortable-table.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SortableColumnComponent, SortableTableDirective],
  exports: [SortableColumnComponent, SortableTableDirective]
})
export class SortableTableModule { }
