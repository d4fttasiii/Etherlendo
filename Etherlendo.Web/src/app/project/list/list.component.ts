import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProjectService } from '../services/project.service';
import { Project } from '../models/project';

@Component({
  selector: 'eth-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  loading: boolean = false;
  projects: Project[];

  constructor(private projectService: ProjectService, private router: Router) { }

  ngOnInit() {
    this.loading = true;
    this.projectService.getProjects().subscribe(
      response => {
        this.projects = response;
        setTimeout(() => this.loading = false, 500);
      },
      error => console.error(error)
    );
  }

  showDetails(project: Project) {
    this.router.navigate(['projects/details', project.id])
  }
}
