import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FormConfig, FormFieldConfig } from 'src/app/models/form-items.model';
import { ConfigStateService } from 'src/app/services/config-state.service';

@Component({
  selector: 'app-config-generator',
  templateUrl: './config-generator.component.html',
})
export class ConfigGeneratorComponent implements OnInit {
  generatorForm!: FormGroup;
  array!: FormArray;

  constructor(
    private fb: FormBuilder,
    private configState: ConfigStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.generatorForm = this.fb.group({
      array: new FormArray([this.getGroupItem()]),
    });
    this.array = this.generatorForm.get('array') as FormArray;
  }

  private getGroupItem(): FormGroup {
    return this.fb.group({
      label: new FormControl(),
      type: new FormControl('text'),
      required: new FormControl(),
      isFocussed: new FormControl(true),
      options: new FormArray([new FormControl()]),
      id: new Date().getTime(),
    });
  }

  addItem(): void {
    this.array.push(this.getGroupItem());
    this.setFocus(this.array.controls.length - 1);
  }

  duplicateItem(index: number, formGroup: FormGroup): void {
    const duplicateGroup = this.getGroupItem();
    const duplicateOptions = duplicateGroup.get('options') as FormArray;
    const optionsControls = (formGroup.get('options') as FormArray)?.controls;
    for (
      let i = 1;
      i < (formGroup.get('options') as FormArray)?.controls.length;
      i++
    ) {
      duplicateOptions.push(new FormControl(optionsControls[i].value));
    }
    duplicateGroup.setValue(formGroup.value);
    this.array.insert(index, duplicateGroup);
  }

  removeItem(index: number): void {
    this.array.removeAt(index);
    this.setFocus(index ? index - 1 : 0);
  }

  addOption(array: FormArray): void {
    array.push(new FormControl());
  }

  removeOption(array: FormArray, index: number): void {
    array.removeAt(index);
  }

  setFocus(index: number): void {
    this.array.controls.forEach((group, i) => {
      group.patchValue({ isFocussed: index === i });
    });
  }

  generateConfig(): void {
    const formConfig: FormConfig = {
      name: 'gen-form',
      fields: this.array.value.map(this.getFieldConfig.bind(this)),
    };
    this.configState.saveConfig(formConfig);
    console.log(this.generatorForm.value, formConfig);
    this.router.navigate(['playground']);
  }

  getFieldConfig(item: any): FormFieldConfig {
    const items = this.getItemOptions(item);
    return {
      name: `field-${item.id}`,
      type: item.type,
      options: {
        label: item.label || 'Label',
        inline: false,
        required: item.required,
        cssClasses: [item.type === 'text' ? 'col-6' : 'col-12'],
        ...(items ? { items } : undefined),
      },
    };
  }

  getItemOptions(item): any {
    const optionTypes = ['select', 'radio', 'checkbox'];
    if (optionTypes.indexOf(item.type) === -1) {
      return;
    }

    return item.options.map((option: string, index: number) => {
      return {
        label: option ? option : `Option ${index + 1}`,
        value: option
          ? option.replace(/\s+/g, '-').toLowerCase()
          : `option-${index + 1}`,
      };
    });
  }
}
