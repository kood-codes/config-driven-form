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
  selector: 'app-dynamic-textarea',
  template: `
    <div
      *ngIf="!config?.hidden"
      class="dynamic-input"
      [formGroup]="group"
      [ngClass]="options?.cssClasses"
    >
      <label *ngIf="options.label && !options.inlineLabel">{{ options.label }}</label>
      <mat-form-field class="d-block" appearance="fill">
        <mat-label *ngIf="options.label && options.inlineLabel">{{ options.label }}</mat-label>
        <textarea
          matInput
          [formControlName]="config.name"
          [placeholder]="options.placeholder"
          [minRows]="options.minRows"
          [maxRows]="options.maxRows"
          #inputItem></textarea>
      </mat-form-field>
    </div>
  `,
})
export class DynamicTextAreaComponent
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
}
