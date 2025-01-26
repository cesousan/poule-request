import { createReducer, on } from '@ngrx/store';
import { MergeRequestsActions } from './merge-requests.actions';
import { initialState } from './merge-requests.state';

export const mergeRequestsReducer = createReducer(
  initialState,
  
  on(MergeRequestsActions.loadMergeRequests, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(MergeRequestsActions.loadMergeRequestsSuccess, (state, { mergeRequests }) => ({
    ...state,
    mergeRequests,
    loading: false
  })),
  
  on(MergeRequestsActions.loadMergeRequestsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
  on(MergeRequestsActions.loadApprovalSuccess, (state, { approval }) => ({
    ...state,
    mergeRequests: state.mergeRequests.map(mr => {
      if (mr.id !== approval.id) return mr;
      return {
        ...mr,
        approvals: approval
      };
    })
  }))
); 