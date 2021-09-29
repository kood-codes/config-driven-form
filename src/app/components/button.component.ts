import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { triggerHook } from '../helpers/hooks-helpers';
import { registerFormControl } from '../helpers/form-helpers';
import {
  DynamicFormField,
  FormFieldConfig,
  FormFieldHooks,
  Hideable,
  Options,
} from '../models/form-items.model';

@Component({
  selector: 'app-dynamic-button',
  template: `
    <div
      *ngIf="!config?.hidden"
      class="dynamic-input"
      [ngClass]="options?.cssClasses"
    >
      <button
        mat-raised-button
        [type]="options.type || 'button'"
        [color]="options.color || 'primary'"
        [disabled]="options.disabled"
        [ripple]="options.ripple"
        [disableRipple]="options.disableRipple"
        [isRoundButton]="options.isRoundButton"
        [isIconButton]="options.isIconButton"
        (click)="onClick($event)"
      >
        {{ options.label }}
      </button>
    </div>
  `,
})
export class DynamicButtonComponent
  implements DynamicFormField, OnInit, OnDestroy
{
  config!: FormFieldConfig & Hideable;
  group!: FormGroup;
  control!: AbstractControl;
  options!: Options;

  ngOnInit(): void {
    this.control = registerFormControl(
      this.group,
      this.config.name,
      this.config
    );

    triggerHook(FormFieldHooks.onInit, this);
  }

  ngOnDestroy(): void {
    triggerHook(FormFieldHooks.onDestroy, this);
  }

  onClick(event: Event): void {
    if (typeof this.options.callback === 'function') {
      this.options.callback(event, this.group, this.config);
    }
  }
}
