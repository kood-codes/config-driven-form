import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';

export enum DynamicComponents {
  text = 'text',
  date = 'date',
  number = 'number',
  textarea = 'textarea',
  select = 'select',
  radio = 'radio',
  checkbox = 'checkbox',
  switch = 'switch',
  button = 'button',
}

export interface BaseObject<T> {
  [key: string]: T;
}

export interface Hideable {
  hidden?: boolean;
}

export interface Extendable {
  parent?: string;
}

export interface FormGroupConfig extends Hideable, Extendable {
  fields: Array<FormFieldConfig | FormGroupConfig>;
  name: string;
  title?: string;
  collapsible?: boolean;
  cssClasses?: Array<string>;
  options?: FormFieldOptions;
  parent?: string;
  groupType?: 'Array';
}

export type FormItem = FormGroupConfig | FormFieldConfig;

export interface FormConfig extends FormGroupConfig {
  customFields?: ComponentsMap;
  hooks?: ConfigFormHooksOptions;
}

export interface DynamicFormField {
  config: FormFieldConfig;
  group: FormGroup;
  options: Options;
}

export interface FormFieldConfig extends Hideable, Extendable {
  name: string;
  type: string;
  options: FormFieldOptions;
  hooks?: FormFieldHooksOptions;
  parent?: string;
}

export type ConfigFormHooksCallbackFn = (
  params?: ConfigFormHooksParams
) => void;

export type FormFieldHooksCallbackFn = (params: FormFieldHooksParams) => void;

export interface ConfigFormHooksParams {
  doneFn: (success?: boolean) => void;
  form: FormGroup;
}

export interface FormFieldHooksParams {
  component: any;
  control: FormControl;
  group: FormGroup;
}

export type FormFieldHooksOptions = {
  [key in FormFieldHooks]?: FormFieldHooksCallbackFn;
};

export type ConfigFormHooksOptions = {
  [key in ConfigFormHooks]?: ConfigFormHooksCallbackFn;
};

export enum FormFieldHooks {
  onInit = 'onInit',
  onDestroy = 'onDestroy',
}

export enum ConfigFormHooks {
  onInit = 'onInit',
  onDestroy = 'onDestroy',
  onSave = 'onSave',
  onSubmit = 'onSubmit',
}

export interface Options {
  [key: string]: any;
}

export type ActivateFn = (
  value: any,
  control?: AbstractControl
) => Array<string | DependentItem> | undefined;

export interface ErrorMessage {
  name: string;
  message: string;
}

export interface CollapseOptions {
  btnColor?: string;
  btnSize?: string;
  hideIcon?: boolean;
  icon?: string;
  iconSize?: string;
  label?: string;
}

export interface DependentItem {
  parent: string;
  items: string[];
}

export interface FormFieldOptions extends Options {
  label?: string;
  placeholder?: string;
  cssClasses?: Array<string>;
  validators?: Array<ValidatorFn>;
  asyncValidators?: Array<AsyncValidatorFn>;
  validationMessages?: Array<ErrorMessage>;
  collapseOptions?: CollapseOptions;
  defaultValue?: any;
  dependents?: Array<string | DependentItem>;
  activateDependentsOn?: boolean | string | ActivateFn;
  mapToField?: string;
  isIban?: boolean;
  isConditionalMandatory?: boolean;
  helperText?: string;
  description?: string;
  preselect?: boolean;
  header?: string;
}

export interface ComponentsMap {
  [key: string]: any;
}

export interface DependentItem {
  parent: string;
  items: string[];
}
