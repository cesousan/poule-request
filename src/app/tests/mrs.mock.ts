import { MergeRequest } from "../models/merge-request.model";

export const mrs: Record<string, MergeRequest[]> = {
    multiple : [
      {
        id: 1,
        title: 'Test MR 1',
        sourceBranch: 'feature/test-1',
        webUrl: 'https://gitlab.com/test/1',
        iid: 1,
        discussions: {
          total: 0,
          unresolvedCount: 0
        },
        author: {
          name: 'John Doe',
          username: 'john_doe',
          avatarUrl: 'https://gitlab.com/avatar1.jpg'
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
        reactions: {
          thumbsUp: 2,
          thumbsDown: 0,
          rocket: 1,
          heart: 3
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
          username: 'jane_doe',
          avatarUrl: 'https://gitlab.com/avatar2.jpg'
        },
        iid: 2,
        discussions: {
          total: 0,
          unresolvedCount: 0
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
          approved: false,
          approvedBy: []
        },
        reactions: {
          thumbsUp: 1,
          thumbsDown: 1,
          rocket: 0,
          heart: 0
        },
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 3,
        title: 'Test MR 3',
        sourceBranch: 'feature/test-3', 
        webUrl: 'https://gitlab.com/test/3',
        author: {
          name: 'Bob Smith',
          username: 'bob_smith',
          avatarUrl: 'https://gitlab.com/avatar3.jpg'
        },
        iid: 3,
        discussions: {
          total: 0,
          unresolvedCount: 0
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
          approvedBy: ['John Doe', 'Jane Doe']
        },
        reactions: {
          thumbsUp: 3,
          thumbsDown: 0,
          rocket: 2,
          heart: 1
        },
        createdAt: '2024-01-01T00:00:00Z',
      }
    ]
}