import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AUTH_SERVICE, IAuthService } from '../../../services/auth.interface';
import { MergeRequestsActions } from '../../../store/merge-requests/merge-requests.actions';
import {
  selectApprovalsProgress,
  selectError,
  selectLoading,
  selectMergeRequests,
} from '../../../store/merge-requests/merge-requests.selectors';
import {
  FilterBarComponent,
  FilterState,
} from '../../components/filter-bar/filter-bar.component';
import { MergeRequestListComponent } from '../../components/merge-request-list/merge-request-list.component';
import { ProgressComponent } from '../../shared/components/progress/progress.component';
import { MergeRequest } from '../../../models/merge-request.model';

@Component({
  selector: 'app-merge-requests-list-page',
  templateUrl: './merge-request-list.page.html',
  styleUrls: ['./merge-request-list.page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FilterBarComponent, MergeRequestListComponent, ProgressComponent],
  standalone: true,
})
export class MergeRequestsListPage {
  private readonly store = inject(Store);
  private readonly authService = inject<IAuthService>(AUTH_SERVICE);

  readonly mergeRequests = this.store.selectSignal(selectMergeRequests);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly error = this.store.selectSignal(selectError);
  readonly approvalsProgress = this.store.selectSignal(selectApprovalsProgress);

  private filterState = signal<FilterState>({
    showApproved: false,
    showPending: true,
    sortBy: 'created',
    sortDirection: 'desc',
    searchTerm: '',
    showOnlyMine: false,
    selectedTags: new Set<string>(),
    selectedCategory: null,
  });

  private readonly currentUser = computed(
    () => this.authService.currentUser?.username || null
  );

  private readonly tagColors = [
    'badge-primary',
    'badge-secondary',
    'badge-accent',
    'badge-info',
    'badge-success',
    'badge-warning',
  ];

  private tagColorMap = new Map<string, string>();

  getTagColor(tag: string): string {
    if (!this.tagColorMap.has(tag)) {
      const colorIndex = this.tagColorMap.size % this.tagColors.length;
      this.tagColorMap.set(tag, this.tagColors[colorIndex]);
    }
    return this.tagColorMap.get(tag)!;
  }

  readonly availableTags = computed(() => {
    const tagMap = new Map<string, Set<string>>();

    this.mergeRequests().forEach((mr) => {
      const tags = mr.project.tagNames;
      if (tags.length > 0) {
        const category = tags[0];
        const subTags = tags.slice(1);

        if (!tagMap.has(category)) {
          tagMap.set(category, new Set<string>());
        }

        subTags.forEach((tag) => {
          tagMap.get(category)!.add(tag);
        });
      }
    });

    return tagMap;
  });

  readonly filteredMergeRequests = computed(() => {
    const mrs = this.mergeRequests();
    const filters = this.filterState();

    const filtered = mrs.filter((mr) => {
      if (mr.approvals?.approved && !filters.showApproved) return false;
      if (!mr.approvals?.approved && !filters.showPending) return false;
      if (filters.showOnlyMine && mr.author.username !== this.currentUser())
        return false;

      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        const searchableText = [
          mr.title,
          mr.sourceBranch,
          mr.project.name,
          mr.author.name,
        ]
          .join(' ')
          .toLowerCase();

        if (!searchableText.includes(searchTerm)) return false;
      }

      if (filters.selectedCategory && filters.selectedCategory !== 'Other') {
        if (mr.project.tagNames[0] !== filters.selectedCategory) return false;
      } else if (filters.selectedCategory === 'Other') {
        if (mr.project.tagNames.length > 1) return false;
      }

      if (filters.selectedTags.size > 0) {
        const hasSelectedTag = mr.project.tagNames.some((tag) =>
          filters.selectedTags.has(tag)
        );
        if (!hasSelectedTag) return false;
      }

      return true;
    });

    if (filters.sortBy !== 'none') {
      return [...filtered].sort((a, b) => {
        let comparison = 0;
        switch (filters.sortBy) {
          case 'created':
            comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            break;
          case 'approvals':
            comparison = (b.approvals?.currentApprovals || 0) - (a.approvals?.currentApprovals || 0);
            break;
          case 'reactions':
            const getReactionScore = (mr: MergeRequest) => 
              mr.reactions.thumbsUp - mr.reactions.thumbsDown + mr.reactions.heart + mr.reactions.rocket;
            comparison = getReactionScore(b) - getReactionScore(a);
            break;
        }
        return filters.sortDirection === 'asc' ? -comparison : comparison;
      });
    }

    return filtered;
  });

  ngOnInit(): void {
    this.store.dispatch(MergeRequestsActions.loadMergeRequests());
  }

  onFiltersChange(filters: FilterState): void {
    this.filterState.update((state) => ({ ...state, ...filters }));
  }
}
