import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeAll, mergeMap, switchMap } from 'rxjs/operators';
import { GITLAB_SERVICE, IGitlabService } from '../../services/gitlab.interface';
import { MergeRequestsActions } from './merge-requests.actions';

const loadMergeRequests = createEffect(
  (
    actions$ = inject(Actions),
    gitlabService = inject<IGitlabService>(GITLAB_SERVICE)
  ) => {
    return actions$.pipe(
      ofType(MergeRequestsActions.loadMergeRequests),
      switchMap(() =>
        gitlabService.getMergeRequests().pipe(
          map(mergeRequests => MergeRequestsActions.loadMergeRequestsSuccess({ mergeRequests })),
          catchError(error => 
            of(MergeRequestsActions.loadMergeRequestsFailure({ 
              error: error?.message || 'Failed to load merge requests' 
            }))
          )
        )
      )
    );
  },
  { functional: true }
);

const loadApprovals = createEffect(
  (
    actions$ = inject(Actions),
    gitlabService = inject<IGitlabService>(GITLAB_SERVICE)
  ) => {
    return actions$.pipe(
      ofType(MergeRequestsActions.loadApprovals),
      mergeMap(({ mergeRequests }) => 
        mergeRequests.map(mr => gitlabService.getApprovals(mr.project.id, mr.iid).pipe(
          map(approval => MergeRequestsActions.loadApprovalSuccess({ approval })),
          catchError(error => 
            of(MergeRequestsActions.loadApprovalFailure({ 
              error: error?.message || 'Failed to load approval for merge request ' + mr.iid 
            }))
          )
        )),
      ),
      mergeAll()
    );
  },
  { functional: true }
);

const loadApprovalsOnMergeRequestsLoaded = createEffect(
  (
    actions$ = inject(Actions),
  ) => {
    return actions$.pipe(
      ofType(MergeRequestsActions.loadMergeRequestsSuccess),
      map(({ mergeRequests }) => 
        MergeRequestsActions.loadApprovals({ mergeRequests })
      )
    );
  },
  { functional: true }
);

export const effects = {
  loadMergeRequests,
  loadApprovalsOnMergeRequestsLoaded,
  loadApprovals
};