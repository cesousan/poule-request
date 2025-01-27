import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { MergeRequest, MergeRequestApproval } from '../../models/merge-request.model';

export const MergeRequestsActions = createActionGroup({
  source: 'Merge Requests',
  events: {
    'Load Merge Requests': emptyProps(),
    'Load Merge Requests Success': props<{ mergeRequests: MergeRequest[] }>(),
    'Load Merge Requests Failure': props<{ error: string }>(),
    'Load Approvals': props<{ mergeRequests: MergeRequest[] }>(),
    'Load Approval Success': props<{ 
      approval: MergeRequestApproval 
    }>(),
    'Load Approval Failure': props<{ error: string }>(),
  }
});