
import { FormControl } from '@angular/forms';
import { DynamicFormField, FormFieldHooks } from '../models/form-items.model';

export function triggerHook(name: FormFieldHooks, component: DynamicFormField): void {
  const control = component.group.get(component.config.name) as FormControl;
  const hook = component.config.hooks && component.config.hooks[name];
  if (typeof hook === 'function') {
    // Triggering the hook with component specific parameters
    hook({
      component, // The component instance
      control, // The component form field
      group: component.group, // The parent form group
    });
  }
}
