import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'eth-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {

  @Input() title: string;
  @Input() description: string;
  @Input() image: string;
  @Output() investClicked = new EventEmitter();

  constructor() { }

  invest(): void {
    this.investClicked.emit();
  }
}
