import { Component } from '@angular/core';
import { MenuItem } from './shared/models/menu-item';

@Component({
  selector: 'eth-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  menuItems: MenuItem[];

  constructor() {
    this.menuItems = [{
      name: 'Projects',
      order: 0,
      path: 'projects'
    },{
      name: 'Start new Project',
      order: 0,
      path: 'projects/start'
    }];
  }
}
