import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { MergeRequest, MergeRequestApproval } from '../models/merge-request.model';

export interface IGitlabService {
  getMergeRequests(): Observable<MergeRequest[]>;
  getApprovals(projectId: number, mrIid: number): Observable<MergeRequestApproval>;
}

export const GITLAB_SERVICE = new InjectionToken<IGitlabService>('GITLAB_SERVICE'); 