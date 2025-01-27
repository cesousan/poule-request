import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  GitlabMergeRequest,
  GitlabMergeRequestApproval,
  MergeRequest,
  MergeRequestApproval,
} from '../models/merge-request.model';
import { AUTH_SERVICE } from './auth.interface';
import { IGitlabService } from './gitlab.interface';

@Injectable()
export class GitlabService implements IGitlabService {
  private readonly apiUrl = 'https://gitlab.com/api/v4';
  private readonly authService = inject(AUTH_SERVICE);
  private readonly http = inject(HttpClient);

  getMergeRequests(): Observable<MergeRequest[]> {
    const token = this.authService.getToken();
    const organizationId = this.authService.getOrganizationId();
    
    if (!token) {
      throw new Error('No token available');
    }
    
    if (!organizationId) {
      throw new Error('No organization ID available');
    }

    return this.http
      .get<GitlabMergeRequest[]>(
        `${this.apiUrl}/groups/${organizationId}/merge_requests`,
        {
          headers: new HttpHeaders({
            'PRIVATE-TOKEN': token,
          }),
          params: {
            state: 'opened',
            scope: 'all',
            per_page: 100,
          },
        }
      )
      .pipe(map((mrs) => mrs.map((mr) => this.transformMergeRequest(mr))));
  }

  private transformMergeRequest(mr: GitlabMergeRequest): MergeRequest {
    const projectName = mr.references.relative.split('!')[0];
    const tagNames = projectName
      .split('/')
      .filter((tag, index, self) => self.indexOf(tag) === index);

    return {
      id: mr.id,
      iid: mr.iid,
      title: mr.title,
      sourceBranch: mr.source_branch,
      webUrl: mr.web_url,
      project: {
        name: projectName,
        id: mr.project_id,
        tagNames,
      },
      author: {
        name: mr.author.name,
        username: mr.author.username,
        avatarUrl: mr.author.avatar_url || '',
      },
      approvals: null,
      discussions: {
        total: mr.discussions_count,
        unresolvedCount: mr.blocking_discussions_resolved
          ? 0
          : mr.user_notes_count,
      },
      reactions: {
        thumbsUp: mr.upvotes,
        thumbsDown: mr.downvotes,
        rocket: 0,
        heart: 0,
      },
      createdAt: mr.created_at,
    };
  }

  getApprovals(
    projectId: number,
    mergeRequestIid: number
  ): Observable<MergeRequestApproval> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No token available');
    }

    return this.http.get<GitlabMergeRequestApproval>(
      `${this.apiUrl}/projects/${projectId}/merge_requests/${mergeRequestIid}/approvals`,
      {
        headers: new HttpHeaders({
          'PRIVATE-TOKEN': token,
        }),
      }
    ).pipe(map((approval) => this.transformApproval(approval)));
  }

  private transformApproval(approval: GitlabMergeRequestApproval): MergeRequestApproval {
    return {
      id: approval.id,
      iid: approval.iid,
      approved: approval.approvals_left === 0,
      approvedBy: approval.approved_by.map(({ user }) => user.name),
      requiredApprovals: approval.approvals_required,
      currentApprovals: approval.approvals_required - approval.approvals_left
    };
  }
}
