import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Project } from '../models/project';
import { ContractService } from '../services/contract.service';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'eth-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  project: Project;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private contractService: ContractService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params.id;
      this.projectService.getProject(id).subscribe(project => {
        this.project = project;
        this.contractService.getProjectDetails(this.project);
      });
    });
  }

  openManagement() {
    this.router.navigate(['/projects/manage', this.project.id]);
  }

}
