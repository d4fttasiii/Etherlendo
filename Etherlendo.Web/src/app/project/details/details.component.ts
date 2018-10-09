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

  id: string;
  project: Project;
  amount: number;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private contractService: ContractService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.loadProjectInfo(this.id);
    });
  }

  openManagement() {
    this.router.navigate(['/projects/manage', this.project.id]);
  }

  invest() {
    if (!this.amount) {
      return;
    }

    this.contractService.invest(this.project.contractAddress, this.amount, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        this.contractService.getProjectDetails(this.project);
      }
    });
  }

  private loadProjectInfo(id: string) {
    this.projectService.getProject(id).subscribe(project => {
      this.project = project;
      this.contractService.getProjectDetails(this.project);
    });
  }

}
