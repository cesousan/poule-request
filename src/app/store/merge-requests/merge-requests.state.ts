import { MergeRequest, MergeRequestApproval } from '../../models/merge-request.model';

export interface MergeRequestsState {
  mergeRequests: MergeRequest[];
  loading: boolean;
  error: string | null;
}

export const initialState: MergeRequestsState = {
  mergeRequests: [],
  loading: false,
  error: null
}; 