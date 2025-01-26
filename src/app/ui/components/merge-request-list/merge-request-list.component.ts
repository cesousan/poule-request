import { Component, Input } from '@angular/core';
import { MergeRequest } from '../../../models/merge-request.model';
import { TagColorPipe } from '../../shared/pipes/tag-color.pipe';

@Component({
  selector: 'app-merge-request-list',
  standalone: true,
  imports: [TagColorPipe],
  template: `
    <div class="space-y-4">
      @for (mr of mergeRequests; track mr.id) {
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <!-- Header with Avatar and Title -->
            <div class="flex items-start space-x-4">
              <!-- Update the author avatar section in the card -->
              <div class="group relative inline-block">
                <div class="avatar tooltip tooltip-left" [attr.data-tip]="mr.author.name">
                  <div class="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img [src]="mr.author.avatarUrl" [alt]="mr.author.name" />
                  </div>
                </div>
              </div>
              
              <div class="flex-1">
                <a [href]="mr.webUrl" 
                   target="_blank"
                   class="card-title link link-hover text-primary">
                  {{ mr.title }}
                </a>
                <p class="mt-2 flex items-center gap-2 text-sm">
                  <span class="flex items-center gap-2">
                    @for (tag of mr.project.tagNames; track tag) {
                      <span class="badge {{ tag | tagColor }}">{{ tag }}</span>
                      @if (!$last) {
                        <span class="text-base-content/50">•</span>
                      }
                    }
                  </span>
                  <span class="text-base-content/50">•</span>
                  <span class="badge badge-ghost">{{ mr.sourceBranch }}</span>
                </p>
              </div>
            </div>

            <!-- Footer with Reactions and Approval -->
            <div class="card-actions justify-between items-center mt-4 pt-4 border-t border-base-200">
              <!-- Reactions -->
              <div class="flex gap-4">
                @if (mr.reactions.thumbsUp) {
                  <div class="badge badge-ghost gap-2">
                    👍 {{ mr.reactions.thumbsUp }}
                  </div>
                }
                @if (mr.reactions.thumbsDown) {
                  <div class="badge badge-ghost gap-2">
                    👎 {{ mr.reactions.thumbsDown }}
                  </div>
                }
                @if (mr.reactions.rocket) {
                  <div class="badge badge-ghost gap-2">
                    🚀 {{ mr.reactions.rocket }}
                  </div>
                }
                @if (mr.reactions.heart) {
                  <div class="badge badge-ghost gap-2">
                    ❤️ {{ mr.reactions.heart }}
                  </div>
                }
              </div>
                @if(mr.approvals) {
                  <!-- Approval Status -->
                  @if (mr.approvals.approved) {
                    <div class="badge badge-success gap-2">
                  ✓ Approved
                </div>
              } @else {
                <div class="badge badge-warning gap-2">
                  ⏳ {{ mr.approvals.currentApprovals }}/{{ mr.approvals.requiredApprovals }} Approvals
                </div>
              }
              @if (mr.discussions.unresolvedCount > 0) {
                <div class="badge badge-error gap-2">
                  💬 {{ mr.discussions.unresolvedCount }} unresolved
                  </div>
                }
              }
            </div>
          </div>
        </div>
      } @empty {
        <div class="card bg-base-100">
          <div class="card-body items-center text-center text-base-content/70">
            <h2 class="card-title">No merge requests found</h2>
            <p>Try adjusting your filters</p>
          </div>
        </div>
      }
    </div>
  `
})
export class MergeRequestListComponent {
  @Input({ required: true }) mergeRequests: MergeRequest[] = [];
  @Input() progress?: { current: number; total: number };
} 