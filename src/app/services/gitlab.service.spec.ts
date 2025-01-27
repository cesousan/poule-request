import { TestBed } from '@angular/core/testing';
import { GitlabService } from './gitlab.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AUTH_SERVICE } from './auth.interface';
import { of } from 'rxjs';
import { GitlabMergeRequest, GitlabMergeRequestApproval } from '../models/merge-request.model';

describe('GitlabService', () => {
  let service: GitlabService;
  let mockHttp: jasmine.SpyObj<HttpClient>;
  let mockAuthService: any;

  const mockGitlabMergeRequest: Partial<GitlabMergeRequest> = {
    id: 1,
    iid: 1,
    title: 'Test MR',
    source_branch: 'feature/test',
    web_url: 'https://gitlab.com/test/1',
    project_id: 1,
    author: {
      name: 'John Doe',
      username: 'john_doe',
      avatar_url: 'https://example.com/avatar.jpg',
      id: 1,
      state: 'active',
      web_url: 'https://gitlab.com/john_doe'
    },
    references: {
      full: 'project!1',
      relative: 'project!1',
      short: '!1'
    },
    upvotes: 1,
    downvotes: 0,
    discussions_count: 0,
    user_notes_count: 0,
    blocking_discussions_resolved: true,
    created_at: '2024-01-01T00:00:00Z'
  };

  const mockGitlabApproval: GitlabMergeRequestApproval = {
    id: 1,
    iid: 1,
    project_id: 1,
    title: 'Test MR',
    approvals_required: 1,
    approvals_left: 0,
    approved_by: [{
      user: {
        name: 'Jane Doe',
        username: 'jane_doe',
        id: 2,
        state: 'active',
        avatar_url: 'https://example.com/jane.jpg',
        web_url: 'https://gitlab.com/jane_doe'
      }
    }],
    approved: true
  };

  beforeEach(() => {
    mockHttp = jasmine.createSpyObj('HttpClient', ['get']);
    mockAuthService = {
      getToken: () => 'fake-token',
      getOrganizationId: () => 'test-org-id'
    };

    TestBed.configureTestingModule({
      providers: [
        GitlabService,
        { provide: HttpClient, useValue: mockHttp },
        { provide: AUTH_SERVICE, useValue: mockAuthService }
      ]
    });

    service = TestBed.inject(GitlabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch merge requests', (done) => {
    mockHttp.get.and.returnValue(of([mockGitlabMergeRequest]));

    service.getMergeRequests().subscribe(mergeRequests => {
      expect(mergeRequests[0]).toEqual({
        id: 1,
        iid: 1,
        title: 'Test MR',
        sourceBranch: 'feature/test',
        webUrl: 'https://gitlab.com/test/1',
        project: {
          name: 'project',
          id: 1,
          tagNames: ['project']
        },
        author: {
          name: 'John Doe',
          username: 'john_doe',
          avatarUrl: 'https://example.com/avatar.jpg'
        },
        approvals: null,
        discussions: {
          total: 0,
          unresolvedCount: 0
        },
        reactions: {
          thumbsUp: 1,
          thumbsDown: 0,
          rocket: 0,
          heart: 0
        },
        createdAt: '2024-01-01T00:00:00Z'
      });
      done();
    });

    expect(mockHttp.get).toHaveBeenCalledWith(
      'https://gitlab.com/api/v4/groups/test-org-id/merge_requests',
      jasmine.objectContaining({
        headers: jasmine.objectContaining({
          get: jasmine.any(Function)
        }),
        params: {
          state: 'opened',
          scope: 'all',
          per_page: 100
        }
      })
    );
  });

  it('should fetch merge request approvals', (done) => {
    mockHttp.get.and.returnValue(of(mockGitlabApproval));

    service.getApprovals(1, 1).subscribe(approval => {
      expect(approval).toEqual({
        id: 1,
        iid: 1,
        approved: true,
        approvedBy: ['Jane Doe'],
        requiredApprovals: 1,
        currentApprovals: 1
      });
      done();
    });

    expect(mockHttp.get).toHaveBeenCalledWith(
      'https://gitlab.com/api/v4/projects/1/merge_requests/1/approvals',
      jasmine.objectContaining({
        headers: jasmine.objectContaining({
          get: jasmine.any(Function)
        })
      })
    );
  });
});