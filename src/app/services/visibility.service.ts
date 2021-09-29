import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { DependentItem } from '../models/form-items.model';

type ItemVisibility = Observable<{
  name?: string | undefined;
  items?: (string | DependentItem)[] | undefined;
}>;

@Injectable()
export class VisibilityService {
  private showSubject$ = new BehaviorSubject<{ name?: string; items?: (string | DependentItem)[] }>({});
  private hideSubject$ = new BehaviorSubject<{ name?: string; items?: (string | DependentItem)[] }>({});

  /**
   * Getter to show an item
   */
  get show$(): ItemVisibility {
    return this.showSubject$.asObservable();
  }

  /**
   * Getter to hide an item
   */
  get hide$(): ItemVisibility {
    return this.hideSubject$.asObservable();
  }

  showItems(name?: string, items?: (string | DependentItem)[]): void {
    this.showSubject$.next({ name, items });
  }

  hideItems(name?: string, items?: (string | DependentItem)[]): void {
    this.hideSubject$.next({ name, items });
  }
}
