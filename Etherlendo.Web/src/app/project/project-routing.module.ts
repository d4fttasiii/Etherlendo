import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { StartComponent } from './start/start.component';
import { ManagementComponent } from './management/management.component';

export const routes: Routes = [
    { path: '', component: ListComponent },    
    { path: 'details/:id', component: DetailsComponent },
    { path: 'start', component: StartComponent },
    { path: 'manage/:id', component: ManagementComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProjectRoutingModule { }