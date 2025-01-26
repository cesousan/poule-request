import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TagColorPipe } from '../../shared/pipes/tag-color.pipe';

export interface FilterState {
  showApproved: boolean;
  showPending: boolean;
  sortBy: 'created' | 'reactions' | 'none';
  sortDirection: 'asc' | 'desc';
  searchTerm: string;
  showOnlyMine: boolean;
  selectedTags: Set<string>;
  selectedCategory: string | null;
}

@Component({
  selector: 'app-filter-bar',
  template: `
    <div class="bg-base-200 sticky top-0 z-10 mb-6 p-4 border-b border-base-300">
      <!-- Search Bar and My MRs -->
      <div class="mb-4 flex items-center gap-4">
        <div class="relative flex-1">
          <input
            type="text"
            [ngModel]="filters.searchTerm"
            (ngModelChange)="updateSearch($event)"
            placeholder="Search merge requests..."
            class="input input-bordered w-full pl-10 bg-base-100 text-base-content"
          >
          <span class="absolute left-3 top-3 opacity-50">
            🔍
          </span>
        </div>

        <button 
          (click)="toggleMyMRs()"
          [class.btn-primary]="filters.showOnlyMine"
          [class.btn-ghost]="!filters.showOnlyMine"
          class="btn btn-sm gap-2">
          <span class="text-sm">👤</span>
          My MRs
        </button>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <!-- Filter Section -->
        <div class="flex flex-col gap-3 w-full">
          <!-- Category Tabs -->
          <div role="tablist" class="tabs tabs-bordered">
            <button role="tab" 
              class="tab"
              [class.tab-active]="!selectedCategory"
              (click)="selectCategory(null)">
              All
            </button>
            @for (category of availableMainTags; track category) {
              <button role="tab"
                class="tab"
                [class.tab-active]="selectedCategory === category"
                (click)="selectCategory(category)">
                {{ category }}
              </button>
            }
            @if (hasEmptyCategories()) {
              <button role="tab"
                class="tab"
                [class.tab-active]="selectedCategory === 'Other'"
                (click)="selectCategory('Other')">
                Other
              </button>
            }
          </div>

          <!-- Tags for Selected Category -->
          <div class="flex flex-wrap gap-2 min-h-12 pl-2">
            @if (selectedCategory) {
              @for (tag of displayedSecondaryTags; track tag) {
                <div 
                  (click)="toggleTag(tag)"
                  class="badge {{ tag | tagColor }} cursor-pointer hover:opacity-80"
                  [class.opacity-50]="!filters.selectedTags.has(tag)">
                  {{ tag }}
                </div>
              }
            }
          </div>

          <!-- Approval Filters and Sort Controls -->
          <div class="flex justify-between items-center">
            <div class="flex gap-2">
              <button 
                (click)="toggleApproved()" 
                [class.btn-primary]="filters.showApproved"
                [class.btn-ghost]="!filters.showApproved"
                class="btn btn-sm">
                Approved
              </button>
              
              <button 
                (click)="togglePending()"
                [class.btn-primary]="filters.showPending"
                [class.btn-ghost]="!filters.showPending"
                class="btn btn-sm">
                Pending
              </button>
            </div>

            <!-- Sort Section -->
            <div class="flex items-center gap-3">
              <span class="text-sm font-medium text-base-content opacity-70">Sort by:</span>
              <div class="join">
                <button
                  (click)="updateSort('created')"
                  [class.btn-primary]="filters.sortBy === 'created'"
                  [class.btn-ghost]="filters.sortBy !== 'created'"
                  class="btn btn-sm join-item">
                  Date
                </button>
                <button
                  (click)="updateSort('reactions')"
                  [class.btn-primary]="filters.sortBy === 'reactions'"
                  [class.btn-ghost]="filters.sortBy !== 'reactions'"
                  class="btn btn-sm join-item">
                  Reactions
                </button>
                <button
                  (click)="toggleSortDirection()"
                  class="btn btn-sm join-item btn-ghost">
                  {{ filters.sortDirection === 'asc' ? '↑' : '↓' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [FormsModule, TagColorPipe]
})
export class FilterBarComponent {
  @Output() filtersChange = new EventEmitter<FilterState>();
  @Input() availableTags: Map<string, Set<string>> = new Map();

  filters: FilterState = {
    showApproved: true,
    showPending: true,
    sortBy: 'none',
    sortDirection: 'desc',
    searchTerm: '',
    showOnlyMine: false,
    selectedTags: new Set<string>(),
    selectedCategory: null
  };

  selectedCategory: string | null = null;

  get availableMainTags(): string[] {
    const mainTags = Array.from(this.availableTags.keys() || [])
      .filter(key => (this.availableTags.get(key)?.size || 0) > 0)
      .sort();
    return mainTags;
  }

  get displayedSecondaryTags(): string[] {
    if (!this.selectedCategory) {
      return [];
    }
    if (this.selectedCategory === 'Other') {
      // Collect tags from empty categories
      const emptyCategories = Array.from(this.availableTags.keys())
        .filter(key => (this.availableTags.get(key)?.size || 0) === 0);
      return emptyCategories.sort();
    }
    const tags = this.availableTags.get(this.selectedCategory); 
    return tags ? Array.from(tags.values()).sort() : [];
  }

  toggleApproved(): void {
    this.filters.showApproved = !this.filters.showApproved;
    this.emitChange();
  }

  togglePending(): void {
    this.filters.showPending = !this.filters.showPending;
    this.emitChange();
  }

  updateSort(sortType: FilterState['sortBy']): void {
    this.filters.sortBy = this.filters.sortBy === sortType ? 'none' : sortType;
    this.emitChange();
  }

  toggleSortDirection(): void {
    this.filters.sortDirection = this.filters.sortDirection === 'asc' ? 'desc' : 'asc';
    this.emitChange();
  }

  updateSearch(term: string): void {
    this.filters.searchTerm = term;
    this.emitChange();
  }

  toggleMyMRs(): void {
    this.filters.showOnlyMine = !this.filters.showOnlyMine;
    this.emitChange();
  }

  selectCategory(category: string | null): void {
    this.selectedCategory = category;
    this.filters.selectedCategory = category;
    this.filters.selectedTags.clear(); // Clear secondary filters when changing category
    this.emitChange();
  }

  toggleTag(tag: string): void {
    if (this.filters.selectedTags.has(tag)) {
      this.filters.selectedTags.delete(tag);
    } else {
      this.filters.selectedTags.add(tag);
    }
    this.emitChange();
  }

  private emitChange(): void {
    this.filtersChange.emit(this.filters);
  }

  hasEmptyCategories(): boolean {
    return Array.from(this.availableTags.keys())
      .some(key => (this.availableTags.get(key)?.size || 0) === 0);
  }
} 