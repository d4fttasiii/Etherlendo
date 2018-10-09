import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { ProjectService } from './services/project.service';
import { SharedModule } from '../shared/shared.module';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { ProjectRoutingModule } from './project-routing.module';
import { StartComponent } from './start/start.component';
import { ContractService } from './services/contract.service';
import { ManagementComponent } from './management/management.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    ProjectRoutingModule
  ],
  declarations: [ListComponent, DetailsComponent, StartComponent, ManagementComponent],
  providers: [ProjectService, ContractService]
})
export class ProjectModule { }
