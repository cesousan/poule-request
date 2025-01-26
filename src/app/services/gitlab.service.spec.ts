import { TestBed } from '@angular/core/testing';
import { GitlabService } from './gitlab.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { GitlabMergeRequest, MergeRequest } from '../models/merge-request.model';

describe('GitlabService', () => {
  let service: GitlabService;

  const mockGitlabApiResponse: Partial<GitlabMergeRequest>[] = [
    {
      id: 1,
      title: 'Test MR',
      source_branch: 'feature/test',
      web_url: 'https://gitlab.com/test/1',
      author: {
        name: 'John Doe',
        avatar_url: 'https://gitlab.com/avatar.jpg',
        id: 1,
        username: 'john_doe',
        web_url: 'https://gitlab.com/john_doe',
        state: 'active'
      },
      project_id: 1,
      upvotes: 2,
      downvotes: 0,
      references: {
        full: 'Test Project!1234567890',
        relative: 'Test Project!1234567890',
        short: '!1234567890'
      },
      merge_status: 'can_be_merged',
      detailed_merge_status: 'can_be_merged',
      reviewers: [
        { name: 'Jane Doe', state: 'approved', id: 2, username: 'jane_doe', avatar_url: 'https://gitlab.com/jane_doe.jpg', web_url: 'https://gitlab.com/jane_doe' }
      ],
      created_at: '2024-01-01T00:00:00Z'
    }
  ];

  const expectedTransformedResponse: MergeRequest[] = [
    {
      id: 1,
      title: 'Test MR',
      sourceBranch: 'feature/test',
      webUrl: 'https://gitlab.com/test/1',
      author: {
        name: 'John Doe',
        username: 'john_doe',
        avatarUrl: 'https://gitlab.com/avatar.jpg'
      },
      project: {
        name: 'Test Project',
        id: 1,
        tagNames:['Test Project']
      },
      approvals: {
        id: 1,
        iid: 1,
        requiredApprovals: 1,
        currentApprovals: 1,
        approved: true,
        approvedBy: ['Jane Doe']
      },
      discussions: {
        total: 0,
        unresolvedCount: 0
      },
      iid: 1,
      reactions: {
        thumbsUp: 2,
        thumbsDown: 0,
        rocket: 0,
        heart: 0
      },
      createdAt: '2024-01-01T00:00:00Z',
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GitlabService,
        { provide: HttpClient, useValue: {
            get: () => of(mockGitlabApiResponse)
        } }
      ]
    });
    service = TestBed.inject(GitlabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch merge requests', (done) => {

    service.getMergeRequests().subscribe({
      next: mergeRequests => {
        expect(mergeRequests).toEqual(expectedTransformedResponse);
        done();
      },
      error: done.fail
    });
  });
});