import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ng2IzitoastService } from 'ng2-izitoast';

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
  investedPercentage: number;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private contractService: ContractService,
    private iziToast : Ng2IzitoastService
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

    this.projectService.invest(this.project.contractAddress, this.amount, (error, result) => {
      if (error) {
        this.iziToast.error(error);
      } else {
        this.loadProjectDetails();
        this.iziToast.success({ message: result, title: 'Invesment successful' });
      }
    });
  }

  private loadProjectInfo(id: string) {
    this.projectService.getProject(id).subscribe(project => {
      this.project = project;
      this.loadProjectDetails();
    });
  }

  private loadProjectDetails() {
    this.contractService.getProjectDetails(this.project.contractAddress).then(responses => {
      const [total, interest, projectEnd, fundedAmount, state] = responses;
      this.project.total = parseInt(total);
      this.project.interest = parseInt(interest);
      this.project.fundingEndsAt = new Date(parseInt(projectEnd) * 1000);
      this.project.investedAmount = parseInt(fundedAmount);
      this.project.started = state == 1;
      this.project.state = state;
      this.project.investedPercentage = (this.project.investedAmount / this.project.total) * 100;
      this.investedPercentage = this.project.investedPercentage;
    });
  }

}
