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
  selector: 'app-dynamic-date',
  template: `
    <div
      *ngIf="!config?.hidden"
      class="dynamic-input"
      [formGroup]="group"
      [ngClass]="options?.cssClasses"
    >
      <label *ngIf="options.label && !options.inlineLabel">{{ options.label }}</label>
      <mat-form-field class="d-block" appearance="fill">
        <mat-label *ngIf="options.label && options.inlineLabel">
          {{ options.label }}
        </mat-label>
        <input matInput [matDatepicker]="picker" #inputItem />
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker
          [color]="options.color"
          [panelClass]="options.panelClass"
          [startView]="options.startView"
          [startAt]="options.startAt"
          [panelClass]="options.panelClass"
          [dateClass]="options.dateClass"
          autocomplete="off"
          #picker
        ></mat-datepicker>
      </mat-form-field>
    </div>
  `,
})
export class DynamicDateInputComponent
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
