import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Project } from '../models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private readonly apiAddress: string = environment.apiAddress;

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiAddress}/project`);
  }

  getProject(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiAddress}/project/${id}`);
  }

  invest(): void {

  }
}
