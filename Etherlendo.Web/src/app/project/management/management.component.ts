import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Project } from '../models/project';
import { ContractService } from '../services/contract.service';
import { ProjectService } from '../services/project.service';
import { Investment } from '../models/investment';

@Component({
  selector: 'eth-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit {

  project: Project;
  inmvestments: Investment[];

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private contractService: ContractService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params.id;
      this.projectService.getProject(id).subscribe(project => {
        this.project = project;
        this.contractService.getProjectDetails(this.project);
        this.loadInvestments();
      });
    });
  }

  startFunding() {
    this.contractService.startFunding(this.project);
  }

  loadInvestments() {
    // this.contractService.getInvestments(this.project).then(
    //   response => {
    //     this.inmvestments = response.length ? response.map(i => {
    //       return {
    //         address: '',
    //         invested: 0
    //       };
    //     }) : [];
    //   }
    // )
  }

}