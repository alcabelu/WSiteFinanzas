import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: '[wsf-close-button]',
  templateUrl: './close-button.component.html',
  styleUrls: ['./close-button.component.scss']
})
export class CloseButtonComponent implements OnInit {

  @Output() onClose: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  close() {
    this.onClose.emit(true);
  }

}
