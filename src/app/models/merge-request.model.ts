export interface GitlabUser {
  id: number;
  name: string;
  username: string;
  state: string;
  avatar_url: string | null;
  web_url: string;
}

export interface GitlabReferences {
  short: string;
  relative: string;
  full: string;
}

export interface GitlabTimeStats {
  time_estimate: number;
  total_time_spent: number;
  human_time_estimate: string | null;
  human_total_time_spent: string | null;
}

export interface GitlabMergeRequest {
  id: number;
  iid: number;
  project_id: number;
  title: string;
  description: string;
  state: string;
  created_at: string;
  updated_at: string;
  target_branch: string;
  source_branch: string;
  upvotes: number;
  downvotes: number;
  author: GitlabUser;
  assignees: GitlabUser[];
  reviewers: GitlabUser[];
  labels: string[];
  draft: boolean;
  work_in_progress: boolean;
  merge_status: string;
  detailed_merge_status: string;
  web_url: string;
  references: GitlabReferences;
  time_stats: GitlabTimeStats;
  merge_when_pipeline_succeeds: boolean;
  merge_commit_sha: string | null;
  squash_commit_sha: string | null;
  discussion_locked: boolean | null;
  should_remove_source_branch: boolean;
  force_remove_source_branch: boolean;
  allow_collaboration: boolean;
  allow_maintainer_to_push: boolean;
  user_notes_count: number;
  blocking_discussions_resolved: boolean;
  discussions_count: number;
  has_conflicts: boolean;
  task_completion_status: {
    count: number;
    completed_count: number;
  };
  subscribed: boolean;
  changes_count: string;
}

export interface MergeRequest {
  id: number;
  iid: number;
  title: string;
  sourceBranch: string;
  webUrl: string;
  project: {
    name: string;
    id: number;
    tagNames: string[];
  };
  author: {
    name: string;
    username: string;
    avatarUrl: string;
  };
  approvals: MergeRequestApproval | null;
  reactions: {
    thumbsUp: number;
    thumbsDown: number;
    rocket: number;
    heart: number;
  };
  createdAt: string;
  discussions: {
    total: number;
    unresolvedCount: number;
  };
}
export interface MergeRequestApproval {
  id: number;
  iid: number;
  approved: boolean;
  approvedBy: string[];
  requiredApprovals: number;
  currentApprovals: number;
}

export interface GitlabMergeRequestApproval {
  id: number;
  iid: number;
  project_id: number;
  title: string;
  approved: boolean;
  approved_by: Array<{ user: GitlabUser }>;
  approvals_required: number;
  approvals_left: number;
} 