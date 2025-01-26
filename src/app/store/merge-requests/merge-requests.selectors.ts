import { createFeature, createSelector } from '@ngrx/store';
import { mergeRequestsReducer } from './merge-requests.reducer';

export const mergeRequestsFeature = createFeature({
  name: 'mergeRequests',
  reducer: mergeRequestsReducer,
  extraSelectors: ({ selectMergeRequests }) => ({
    selectApprovalsProgress: createSelector(
      selectMergeRequests,
      (mergeRequests) => ({
        current: mergeRequests.filter(mr => mr.approvals !== null).length,
        total: mergeRequests.length
      })
    )
  })
});

export const {
  selectMergeRequestsState,
  selectMergeRequests,
  selectLoading,
  selectError,
  selectApprovalsProgress
} = mergeRequestsFeature;
 