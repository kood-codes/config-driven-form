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
import { VisibilityService } from '../services/visibility.service';
import { ActivatableFormField } from '../models/activatable-form-field';

@Component({
  selector: 'app-dynamic-select',
  template: `
    <div
      *ngIf="!config?.hidden"
      class="dynamic-input"
      [formGroup]="group"
      [ngClass]="options?.cssClasses"
    >
      <label *ngIf="options.label && !options.inlineLabel">
        {{ options.label }}
      </label>
      <mat-form-field class="d-block" appearance="fill" (change)="toggleDependents()">
        <mat-label *ngIf="options.label && options.inlineLabel">{{
          options.label
        }}</mat-label>
        <mat-select
          (selectionChange)="toggleDependents()"
          [formControlName]="config.name"
          [placeholder]="options.placeholder"
          [multiple]="options.multiple"
          [panelClass]="options.panelClass"
          [disableRipple]="options.disableRipple"
        >
          <mat-option *ngFor="let item of options.items" value="item.value">{{
            item.label
          }}</mat-option>
        </mat-select>
      </mat-form-field>
    </div>
  `,
})
export class DynamicSelectComponent
  extends ActivatableFormField
  implements DynamicFormField, OnInit, OnDestroy
{
  constructor(private readonly visibilityService: VisibilityService) {
    super(visibilityService);
  }

  ngOnInit(): void {
    this.control = registerFormControl(
      this.group,
      this.config.name,
      this.config
    );
    this.toggleDependents();

    triggerHook(FormFieldHooks.onInit, this);
  }

  ngOnDestroy(): void {
    triggerHook(FormFieldHooks.onDestroy, this);
  }
}
