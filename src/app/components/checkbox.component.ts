import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, AbstractControl, FormControl } from '@angular/forms';
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
  selector: 'app-dynamic-checkbox',
  template: `
    <div
      *ngIf="!config?.hidden"
      class="dynamic-input"
      [ngClass]="options?.cssClasses"
    >
      <section class="mat-form-field-wrapper">
        <ng-container *ngIf="options?.items?.length; else singleCheckboxTmpl">
          <label>{{ options.label }}</label>
          <div
            [ngClass]="{ 'd-inline-block': options.isInline }"
            [formGroup]="checkboxGroup"
          >
            <div
              [ngClass]="{ 'd-inline-block': options.isInline }"
              *ngFor="let item of options.items"
            >
              <mat-checkbox
                class="p-2"
                (selectionChange)="toggleDependents()"
                [formControlName]="item.value"
                [color]="options.color || 'primary'"
                [ripple]="options.ripple"
                [disableRipple]="options.disableRipple"
                [labelPosition]="options.labelPosition"
                [indeterminate]="options.indeterminate"
                >{{ item.label }}</mat-checkbox
              >
            </div>
          </div>
        </ng-container>
      </section>
    </div>
    <ng-template #singleCheckboxTmpl>
      <div [formGroup]="group">
        <mat-checkbox
          (selectionChange)="toggleDependents()"
          [formControlName]="config.name"
          [color]="options.color || 'primary'"
          [ripple]="options.ripple"
          [disableRipple]="options.disableRipple"
          [labelPosition]="options.labelPosition"
          [indeterminate]="options.indeterminate"
          >{{ options.label }}</mat-checkbox
        >
      </div>
    </ng-template>
  `,
})
export class DynamicCheckboxComponent
  extends ActivatableFormField
  implements DynamicFormField, OnInit, OnDestroy
{
  checkboxGroup!: FormGroup;

  constructor(private readonly visibilityService: VisibilityService) {
    super(visibilityService);
  }

  ngOnInit(): void {
    if (this.options.items?.length) {
      this.checkboxGroup = new FormGroup({});
      for (const item of this.options.items) {
        this.checkboxGroup.addControl(item.value, new FormControl(false));
      }

      this.group.addControl(this.config.name, this.checkboxGroup);
    } else {
      this.control = registerFormControl(
        this.group,
        this.config.name,
        this.config
      );
    }
    this.toggleDependents();

    triggerHook(FormFieldHooks.onInit, this);
  }

  ngOnDestroy(): void {
    triggerHook(FormFieldHooks.onDestroy, this);
  }
}
