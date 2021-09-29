import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import defaultConfig from '../default-config';
import { FormConfig } from '../models/form-items.model';

@Injectable()
export class ConfigStateService {
  private config = new BehaviorSubject<string>(defaultConfig);

  getConfig(): string {
    return this.config.value;
  }

  saveConfig(config: FormConfig | string): void {
    this.config.next(
      typeof config === 'string' ? config : JSON.stringify(config, null, 2)
    );
  }
}
