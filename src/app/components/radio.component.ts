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
import { ActivatableFormField } from '../models/activatable-form-field';
import { VisibilityService } from '../services/visibility.service';

@Component({
  selector: 'app-dynamic-radio',
  template: `
    <div
      *ngIf="!config?.hidden"
      class="dynamic-input"
      [formGroup]="group"
      [ngClass]="options?.cssClasses"
    >
      <section class="mat-form-field-wrapper">
        <label>{{ options.label }}</label>
        <ng-container *ngIf="options.items.length">
          <mat-radio-group
            [formControlName]="config.name"
            [color]="options.color || 'primary'"
            [labelPosition]="options.labelPosition"
            (change)="toggleDependents()"
            >
            <div [ngClass]= "{'d-inline-block': options.isInline}" *ngFor="let item of options.items">
              <mat-radio-button
                class="p-2"
                [value]="item.value"
                [ripple]="options.ripple"
                [disableRipple]="options.disableRipple"
                >{{ item.label }}
              </mat-radio-button>
            </div>
          </mat-radio-group>
        </ng-container>
      </section>
    </div>
  `,
})
export class DynamicRadioComponent
  extends ActivatableFormField implements OnInit, OnDestroy
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
