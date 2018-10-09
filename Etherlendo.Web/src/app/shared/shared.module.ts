import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NaviComponent } from './navi/navi.component';
import { CardComponent } from './card/card.component';
import { CardifyPipe } from './pipes/cardify.pipe';
import { EtherPipe } from './pipes/ether.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [NaviComponent, CardComponent, CardifyPipe, EtherPipe],
  declarations: [NaviComponent, CardComponent, CardifyPipe, EtherPipe]
})
export class SharedModule { }
