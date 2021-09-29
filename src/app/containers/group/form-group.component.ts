import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  Validators,
} from '@angular/forms';
import { map, takeUntil } from 'rxjs/operators';
import { VisibilityService } from '../../services/visibility.service';
import { mapDependentItems } from '../../helpers/form-helpers';
import {
  FormGroupConfig,
  FormItem,
  Hideable,
} from '../../models/form-items.model';

@Component({
  selector: 'app-dynamic-group',
  templateUrl: './form-group.component.html',
})
export class DynamicGroupComponent implements OnInit, OnDestroy {
  /**
   * The config of the form group
   */
  @Input() config!: FormGroupConfig & Hideable;
  /**
   * The parent formgroup
   */
  @Input() group!: FormGroup;
  gc$ = new EventEmitter();
  eventName!: string;

  constructor(private readonly visibilityService: VisibilityService) {}

  ngOnInit(): void {
    this.eventName = this.config.parent
      ? `${this.config.parent}.${this.config.name}`
      : this.config.name;
    this.visibilityService.show$
      .pipe(
        map(({ name, items }) =>
          mapDependentItems(items, name).find(
            (dep) => dep.parent === this.eventName
          )
        ),
        takeUntil(this.gc$)
      )
      .subscribe((data) => {
        if (data?.items?.length) {
          this.showFields(data.items);
        }
      });

    this.visibilityService.hide$
      .pipe(
        map(({ name, items }) =>
          mapDependentItems(items, name).find(
            (dep) => dep.parent === this.eventName
          )
        ),
        takeUntil(this.gc$)
      )
      .subscribe((data) => {
        if (data?.items?.length) {
          this.hideFields(data.items);
        }
      });
  }

  scanHideableItems(items: string[]): {
    [key: string]: boolean;
  } {
    const hideableFields: { [key: string]: boolean } = {};
    items.forEach((itemName: string) => {
      hideableFields[itemName] = true;
    });
    return hideableFields;
  }

  showFields(fieldsNames: string[]): void {
    const hideableFields = this.scanHideableItems(fieldsNames);
    let control: AbstractControl | null;
    this.config.fields.forEach((field: FormItem & Hideable) => {
      if (hideableFields[field.name]) {
        field.hidden = false;
        control = this.group.get(`${this.config.name}.${field.name}`);
        if (control && field?.options?.isConditionalMandatory) {
          control.setValidators([
            Validators.required,
            ...(field.options.validators || []),
          ]);
          control.setAsyncValidators([
            ...(field.options.asyncValidators || []),
          ]);
          control.updateValueAndValidity();
        }
      }
    });
  }

  hideFields(fieldsNames: string[]): void {
    const hideableFields = this.scanHideableItems(fieldsNames);
    let control: AbstractControl | null;

    this.config.fields.forEach((field: FormItem & Hideable) => {
      if (hideableFields[field.name]) {
        field.hidden = true;
        control = field?.options?.mapToField
          ? this.getMappedField(field.name, field.options.mapToField)
          : this.group.get(`${this.config.name}.${field.name}`);

        if (control && !field?.options?.keepValueOnHidden) {
          if (field?.options?.isConditionalMandatory) {
            control.setValidators(null);
            control.setAsyncValidators(null);
            control.updateValueAndValidity();
          }
          control.reset();
          if (field?.options?.defaultValue) {
            control.patchValue(field.options.defaultValue);
          }
        }
        this.hideNestedField(field);

        if ((field as FormGroupConfig)?.fields?.length) {
          (field as FormGroupConfig)?.fields?.forEach((nestedField) =>
            this.hideNestedField(nestedField)
          );
        }
      }
    });
  }

  private hideNestedField(field: FormItem): void {
    if (field?.options?.dependents && !field?.options?.keepDependentsOnHide) {
      mapDependentItems(field.options.dependents, field.parent).forEach(
        ({ parent, items }) => {
          this.visibilityService.hideItems(parent, items);
        }
      );
    }
  }

  private getMappedField(
    fieldName: string,
    mapToField: string
  ): AbstractControl | null {
    let parent: FormGroup | FormArray | null = this.group;
    let control: AbstractControl | null;

    while (parent) {
      control = parent.get(`${mapToField}.${fieldName}`);
      if (control) {
        return control;
      }
      parent = parent.parent;
    }
    return null;
  }

  ngOnDestroy(): void {
    this.gc$.next();
    this.gc$.complete();
  }
}
