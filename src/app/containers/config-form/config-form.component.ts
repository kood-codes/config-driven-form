import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import {
  FormConfig,
  FormFieldConfig,
  FormGroupConfig,
  FormItem,
} from '../../models/form-items.model';
import { ComponentsFactoryService } from '../../services/components-factory.service';
import { VisibilityService } from '../../services/visibility.service';

@Component({
  selector: 'app-config-form',
  templateUrl: './config-form.component.html',
  providers: [VisibilityService, ComponentsFactoryService],
})
export class ConfigFormComponent implements OnInit, OnDestroy {
  /**
   * The payment type config. Containas the details of all the fields and details of a payment type.
   */
  @Input() config!: FormConfig;
  /**
   * Event emitted when the form is submitted.
   */
  @Output() submitForm = new EventEmitter();
  /**
   * Event emitted when the form is reset.
   */
  @Output() clear = new EventEmitter();
  /**
   * The actual formgroup item.
   */
  @Input() formItem?: FormGroup;
  /**
   * Flag that denotes if form is being submitted
   */
  @Input() set submitting(isSubmitting: boolean) {
    this.isSubmitting$.next(isSubmitting);
  }

  private isSubmitting$ = new BehaviorSubject<boolean>(false);
  form!: FormGroup;
  controls: Array<FormItem> = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly componentsFactory: ComponentsFactoryService
  ) {}

  ngOnInit(): void {
    this.form = this.formItem || this.fb.group({});
    this.componentsFactory.registerCustomFields(this.config.customFields);
    this.createFormFields(this.config.fields, this.form, this.controls);
  }

  ngOnDestroy(): void {}

  createFormFields(
    arr: Array<FormFieldConfig | FormGroupConfig>,
    formGroup: FormGroup | FormArray,
    controlsArr: Array<FormItem>,
    parentName?: string
  ): void {
    arr.forEach((control: FormItem) => {
      const mappedField = control.options && control.options.mapToField;
      const parentControl = mappedField
        ? (this.form.get(mappedField) as FormGroup)
        : formGroup;
      const parent = mappedField || parentName;
      const subArray: Array<FormItem> = [];

      if ((control as FormGroupConfig).fields instanceof Array) {
        if ((control as FormGroupConfig).groupType) {
          const formArray =
            (parentControl.get(control.name) as FormArray) || new FormArray([]);
          this.createFormFields(
            (control as FormGroupConfig).fields,
            formArray,
            subArray,
            parent ? `${parent}.${control.name}` : control.name
          );
        } else {
          const subGroup =
            (parentControl.get(control.name) as FormGroup) || this.fb.group({});
          this.createFormFields(
            (control as FormGroupConfig).fields,
            subGroup,
            subArray,
            parent ? `${parent}.${control.name}` : control.name
          );
          if (typeof (parentControl as FormArray).push === 'function') {
            (parentControl as FormArray).push(subGroup);
          } else {
            (parentControl as FormGroup).addControl(control.name, subGroup);
          }
          controlsArr.push({
            ...control,
            fields: subArray,
            parent: parentName,
          });
        }
      } else {
        controlsArr.push({ ...control, parent });
      }
    });
  }

  getFormGroup(field: FormItem): FormGroup {
    return (this.form.get(field.parent as string) as FormGroup) || this.form;
  }

  onSubmit(): void {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.valid && !this.submitting) {
      this.submitForm.emit(this.form);
    }
  }

  resetForm(): void {
    this.clear.emit();
  }
}
