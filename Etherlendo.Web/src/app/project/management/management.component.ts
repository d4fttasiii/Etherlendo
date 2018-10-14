import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ng2IzitoastService } from 'ng2-izitoast';

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

  id: string;
  project: Project;
  inmvestments: Investment[];

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private contractService: ContractService,
    private iziToast: Ng2IzitoastService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.projectService.getProject(this.id).subscribe(project => {
        this.project = project;
        this.contractService.getProjectDetails(this.project.contractAddress).then(responses => {
          const [total, interest, projectEnd, fundedAmount, state] = responses;
          this.project.total = parseInt(total);
          this.project.interest = parseInt(interest);
          this.project.fundingEndsAt = new Date(parseInt(projectEnd) * 1000);
          this.project.investedAmount = parseInt(fundedAmount);
          this.project.started = state == 1;
          this.project.state = state;
          this.project.investedPercentage = (this.project.investedAmount / this.project.total) * 100;
        });
      });
    });
  }

  startFunding() {
    this.contractService.startFunding(this.project.contractAddress, (error, result) => {
      if (error) {
        this.iziToast.error(error);
      }
      else {
        this.iziToast.success({ title: 'Funding started' });
        this.loadProjectInfo(this.id);
      }
    });
  }

  loadProjectInfo(id: string, callback: () => void = null) {
    this.projectService.getProject(id).subscribe(project => {
      this.project = project;
      this.contractService.getProjectDetails(this.project.contractAddress).then(responses => {
        const [total, interest, projectEnd, fundedAmount, state] = responses;
        this.project.total = parseInt(total);
        this.project.interest = parseInt(interest);
        this.project.fundingEndsAt = new Date(parseInt(projectEnd) * 1000);
        this.project.investedAmount = parseInt(fundedAmount);
        this.project.started = state == 1;
        this.project.state = state;
        this.project.investedPercentage = (this.project.investedAmount / this.project.total) * 100;
      });
      callback && callback();
    });
  }

  loadInvestments(): void {
    if (!this.project.started) {
      return;
    }
    this.contractService.getInvestments(this.project).then(
      response => {
        // this.inmvestments = response.length ? response.map(i => {
        //   return {
        //     address: '',
        //     invested: 0
        //   };
        // }) : [];
        console.log(response);
      }
    )
  }

  transferToReceiver() {
    this.contractService.transferToReceiver(this.project.contractAddress).then(
      response => {
        this.iziToast.success({ title: 'Funds transfered to receiver' });
      }, 
      error => this.iziToast.error(error));
  }

}
