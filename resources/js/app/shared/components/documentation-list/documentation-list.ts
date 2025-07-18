import { Component, signal, computed, input, effect } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ChangeDetectionStrategy } from '@angular/core';

export interface DocumentItem {
  name: string;
  url: string;
}

export interface DocumentationListConfig {
  documents: DocumentItem[];
  action?: (doc: DocumentItem, event?: Event) => void;
  actionIcon?: string;
}

@Component({
  selector: 'app-documentation-list',
  imports: [ButtonModule, RippleModule],
  templateUrl: './documentation-list.html',
  styleUrl: './documentation-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentationList {
  input = input<DocumentationListConfig | undefined>();

  private _documents = signal<DocumentItem[]>([]);
  private _action: ((doc: DocumentItem, event?: Event) => void) | undefined;
  private _actionIcon = '';
  hovered: string | null = null;

  constructor() {
    effect(() => {
      const config = this.input();
      if (config && typeof config === 'object') {
        if (Array.isArray(config.documents)) {
          this._documents.set(config.documents);
        }
        if (typeof config.action === 'function') {
          this._action = config.action;
        }
        if (typeof config.actionIcon === 'string') {
          this._actionIcon = config.actionIcon;
        }
      }
    });
  }

  documents = computed(() => this._documents());
  actionIcon = computed(() => this._actionIcon);
  get onAction() { return this._action; }

  onHover(name: string | null) {
    this.hovered = name;
  }

  openDocument(url: string, event: Event) {
    if ((event.target as HTMLElement).closest('.action-btn')) return;
    window.open(url, '_blank');
  }

  onActionClick(doc: DocumentItem, event: MouseEvent) {
    event.stopPropagation();
    if (this.onAction) {
      this.onAction(doc, event);
    }
  }
}
