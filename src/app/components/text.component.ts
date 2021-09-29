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
  selector: 'app-dynamic-text',
  template: `
    <div
      *ngIf="!config?.hidden"
      class="dynamic-input"
      [formGroup]="group"
      [ngClass]="options?.cssClasses"
    >
      <label
        *ngIf="options.label && !options.inlineLabel"
      >
        {{ options.label }}
      </label>
      <mat-form-field class="d-block" appearance="fill">
        <mat-label *ngIf="options.label && options.inlineLabel">
          {{ options.label }}
        </mat-label>
        <input
          matInput
          autocomplete="off"
          [formControlName]="config.name"
          [placeholder]="options.placeholder"
          [type]="options.type || 'text'"
          #inputItem
        />
      </mat-form-field>
    </div>
  `,
})
export class DynamicTextComponent
  implements DynamicFormField, OnInit, OnDestroy
{
  config!: FormFieldConfig & Hideable;
  options!: Options;
  group!: FormGroup;
  control!: AbstractControl;

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
}
