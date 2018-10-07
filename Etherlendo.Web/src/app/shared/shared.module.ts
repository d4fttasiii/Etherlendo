import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NaviComponent } from './navi/navi.component';
import { CardComponent } from './card/card.component';
import { CardifyPipe } from './cardify.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [NaviComponent, CardComponent],
  declarations: [NaviComponent, CardComponent, CardifyPipe]
})
export class SharedModule { }
