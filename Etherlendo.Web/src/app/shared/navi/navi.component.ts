import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { MenuItem } from '../models/menu-item';
import { Router } from '@angular/router';

@Component({
  selector: 'eth-navi',
  templateUrl: './navi.component.html',
  styleUrls: ['./navi.component.scss']
})
export class NaviComponent implements OnChanges {

  @Input() menuItems: MenuItem[];

  constructor(private router: Router) { }

  ngOnChanges(changes) {
    // if (this.menuItems) {
    //   this.menuItems = this.menuItems.sort(m => m.order);
    // }
  }

  navigate(menuItem: MenuItem){
    this.router.navigate([menuItem.path]);
  }

}
