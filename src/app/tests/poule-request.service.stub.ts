import { Observable, of, throwError } from 'rxjs';
import { MergeRequest } from '../models/merge-request.model';

export class GitlabServiceStub {
  mockMergeRequests: MergeRequest[] = [
    {
      id: 1,
      title: 'Test MR 1',
      sourceBranch: 'feature/test-1',
      webUrl: 'https://gitlab.com/test/1',
      author: {
        name: 'John Doe',
        avatarUrl: 'https://gitlab.com/avatar1.jpg'
      },
      approvals: {
        approved: true,
        approvedBy: ['Jane Doe']
      },
      reactions: {
        thumbsUp: 2,
        thumbsDown: 0,
        rocket: 1,
        heart: 3
      },
      project: {
        name: 'Test Project',
        id: 1
      },
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      title: 'Test MR 2',
      sourceBranch: 'feature/test-2',
      webUrl: 'https://gitlab.com/test/2',
      author: {
        name: 'Jane Doe',
        avatarUrl: 'https://gitlab.com/avatar2.jpg'
      },
      approvals: {
        approved: false,
        approvedBy: []
      },
      reactions: {
        thumbsUp: 1,
        thumbsDown: 1,
        rocket: 0,
        heart: 0
      },
      project: {
        name: 'Test Project',
        id: 1
      },
      createdAt: '2024-01-01T00:00:00Z',
    }
  ];

  getMergeRequests(): Observable<MergeRequest[]> {
    return of(this.mockMergeRequests);
  }
}

export class GitlabServiceStubError {
  getMergeRequests(): Observable<never> {
    return throwError(() => new Error('Failed to load merge requests'));
  }
}