
import { FormGroup, AbstractControl } from '@angular/forms';
import { mapDependentItems } from '../helpers/form-helpers';
import { VisibilityService } from '../services/visibility.service';
import { DynamicFormField, FormFieldOptions, FormFieldConfig, DependentItem } from './form-items.model';

export class ActivatableFormField implements DynamicFormField {
  /**
   * Payment form field options
   */
  options!: FormFieldOptions;

  /**
   * Payment form field configuration
   */
  config!: FormFieldConfig;

  /**
   * Form group object
   * Tracks the value and validity state of a group of FormControl instances
   */
  group!: FormGroup;

  /**
   * Base class for FormControl, FormGroup, and FormArray
   */
  control!: AbstractControl;

  /**
   * @internal
   */
  constructor(private readonly service: VisibilityService) {}

  /**
   * @internal
   */
  private showDependentFields(): void {
    if (this.config.options && this.config.options.dependents) {
      this.service.showItems(this.config.parent, this.config.options.dependents);
    }
  }

  /**
   * @internal
   */
  private hideDependentFields(): void {
    if (this.config.options) {
      this.service.hideItems(this.config.parent, this.config.options.dependents);
    }
  }

  /**
   * Tracks if a form item should be shown or not
   */
  toggleDependents(): void{
    const { options, parent: currentParent } = this.config;
    if (options && options.dependents) {
      if (typeof options.activateDependentsOn === 'function') {
        const toShow = options.activateDependentsOn(this.control) || [];
        const toShowMap = mapDependentItems(toShow, currentParent);
        const toHide = mapDependentItems(options?.dependents, currentParent).map(({ parent, items }: DependentItem) => {
          const toShowItem = toShowMap.find((i: DependentItem) => i.parent === parent);
          if (toShowItem) {
            return { parent, items: items.filter(i => !toShowItem.items.includes(i)) };
          } else {
            return { parent, items };
          }
        });

        mapDependentItems(toShow, currentParent).forEach(({ parent, items }) => {
          if (items.length) {
            this.service.showItems(parent, items);
          }
        });

        mapDependentItems(toHide, currentParent).forEach(({ parent, items }) => {
          if (items.length) {
            this.service.hideItems(parent, items);
          }
        });
      } else if (this.control.value === this.config.options.activateDependentsOn) {
        this.showDependentFields();
      } else {
        this.hideDependentFields();
      }
    }
  }
}
