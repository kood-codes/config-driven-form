import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  DependentItem as DependentItem,
  FormFieldConfig,
  FormGroupConfig,
} from '../models/form-items.model';

/**
 * Registers a FormControl in the provided FormGroup
 */
export function registerFormControl(
  parent: FormGroup | FormArray,
  formControlName: string,
  config?: FormFieldConfig,
  defaultValue: any = ''
): AbstractControl {
  const control: AbstractControl = new FormControl(
    defaultValue,
    config.options?.validators || [],
    config.options?.asyncValidators || []
  );
  if (typeof (parent as FormArray).push === 'function') {
    (parent as FormArray).push(control);
  } else {
    (parent as FormGroup).addControl(formControlName, control);
  }

  return control;
}

/**
 * Converts the nested form array into a flat map. It is used to lookup any fields easily
 */
export const createControlsMap = (
  controls: Array<FormFieldConfig | FormGroupConfig>,
  controlsMap: { [key: string]: FormFieldConfig | FormGroupConfig } = {}
) => {
  let path: string;
  return controls.reduce(
    (
      acc: { [key: string]: FormFieldConfig | FormGroupConfig },
      control: FormFieldConfig | FormGroupConfig
    ) => {
      path = control.parent
        ? `${control.parent}.${control.name}`
        : control.name;
      if ((control as FormGroupConfig).fields) {
        acc = {
          ...acc,
          ...createControlsMap((control as FormGroupConfig).fields, acc),
        };
      } else {
        acc[path] = control;
      }
      return acc;
    },
    controlsMap
  );
};

export function registerFormGroup(
  group: FormGroup,
  formGroupName: string,
  formGroupConfig: { [key: string]: any[] },
  validators?: Array<ValidatorFn>,
  asyncValidators?: Array<AsyncValidatorFn>
): AbstractControl | null {
  const subGroup =
    (group.get(formGroupName) as FormGroup) ||
    new FormGroup({}, validators || [], asyncValidators || []);

  for (const key in formGroupConfig) {
    if (formGroupConfig.hasOwnProperty(key)) {
      subGroup.registerControl(
        key,
        new FormControl(
          formGroupConfig[key].shift(),
          (formGroupConfig[key].shift() as Array<ValidatorFn>) || []
        )
      );
    }
  }
  group.addControl(formGroupName, subGroup);

  return group.get(formGroupName);
}

export function getParentForm(control: AbstractControl): FormGroup {
  let ancestor = control;

  while (ancestor && ancestor.parent) {
    ancestor = ancestor.parent;
  }

  return ancestor as FormGroup;
}

export function createValidatorFromRegex(pattern: string): ValidatorFn {
  if (pattern.startsWith('/') && pattern.endsWith('/')) {
    pattern = pattern.slice(1, -1);
  }

  return Validators.pattern(new RegExp(pattern));
}

export function resetValidators(
  formControl: AbstractControl,
  validators?: Array<ValidatorFn>,
  asyncValidators?: Array<AsyncValidatorFn>,
  config?: FormFieldConfig
): void {
  const computedValidators = validators ? [...validators] : [];

  if (!config?.hidden && config?.options?.isConditionalMandatory) {
    computedValidators.push(Validators.required);
  }

  formControl.markAsUntouched();
  formControl.clearValidators();
  formControl.clearAsyncValidators();
  formControl.setAsyncValidators(asyncValidators || []);
  formControl.setValidators(computedValidators);
}

export function registerFormArray(
  group: FormGroup,
  formArrayName: string,
  validators?: Array<ValidatorFn>,
  asyncValidators?: Array<AsyncValidatorFn>
): FormArray {
  const array =
    (group.get(formArrayName) as FormArray) ||
    new FormArray([], validators || [], asyncValidators || []);
  group.addControl(formArrayName, array);
  return group.get(formArrayName) as FormArray;
}

export function addControlToFormArray(
  array: FormArray,
  formGroupConfig: any[],
  validators?: Array<ValidatorFn>,
  asyncValidators?: Array<AsyncValidatorFn>,
  initialValue: any = null
): FormArray {
  const subGroup = new FormGroup({}, validators || [], asyncValidators || []);
  formGroupConfig.forEach((formConfig) => {
    if (formConfig.name) {
      subGroup.registerControl(
        formConfig.name,
        new FormControl(
          initialValue,
          (formConfig.validators as Array<ValidatorFn>) || []
        )
      );
    }
  });
  array.push(subGroup);
  return array;
}

export function mapDependentItems(
  dependents: Array<string | DependentItem> = [],
  currentParent?: string
): DependentItem[] {
  const localDeps: string[] = [];
  const dependentItems = dependents.reduce((result, dep): DependentItem[] => {
    if (typeof dep === 'string') {
      localDeps.push(dep);
      return result;
    } else {
      return [...result, dep];
    }
  }, [] as DependentItem[]);
  return [
    ...dependentItems,
    { parent: currentParent as string, items: localDeps },
  ];
}
