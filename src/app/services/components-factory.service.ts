import {
  ComponentsMap,
  DynamicComponents,
  DynamicFormField,
} from '../models/form-items.model';
import { Injectable } from '@angular/core';
import { FormConfig } from '../models/form-items.model';
import { DynamicTextComponent } from '../components/text.component';
import { DynamicTextAreaComponent } from '../components/textarea.component';
import { DynamicNumberInputComponent } from '../components/number.component';
import { DynamicDateInputComponent } from '../components/date.component';
import { DynamicSelectComponent } from '../components/select.component';
import { DynamicCheckboxComponent } from '../components/checkbox.component';
import { DynamicRadioComponent } from '../components/radio.component';
import { DynamicButtonComponent } from '../components/button.component';

export const DynamicComponentsMap = {
  [DynamicComponents.text]: DynamicTextComponent,
  [DynamicComponents.textarea]: DynamicTextAreaComponent,
  [DynamicComponents.checkbox]: DynamicCheckboxComponent,
  [DynamicComponents.radio]: DynamicRadioComponent,
  [DynamicComponents.number]: DynamicNumberInputComponent,
  [DynamicComponents.date]: DynamicDateInputComponent,
  [DynamicComponents.select]: DynamicSelectComponent,
  [DynamicComponents.button]: DynamicButtonComponent,
};

@Injectable()
export class ComponentsFactoryService {
  private componentsMap = { ...DynamicComponentsMap };

  registerCustomFields(components?: ComponentsMap): void {
    for (const key in components) {
      if (components.hasOwnProperty(key)) {
        this.componentsMap[key] = components[key];
      }
    }
  }

  getFormField(formFieldType: string): any {
    return this.componentsMap[formFieldType];
  }
}
