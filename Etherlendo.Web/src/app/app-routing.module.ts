import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
    path: 'projects',
    loadChildren: './project/project.module#ProjectModule'
}, {
    path: '', pathMatch: 'full',
    redirectTo: '/projects',
}];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }