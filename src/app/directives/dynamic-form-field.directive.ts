import {
  Directive,
  Input,
  OnInit,
  ComponentFactoryResolver,
  ViewContainerRef,
  ComponentRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicFormField,
  FormFieldConfig,
  Options,
} from '../models/form-items.model';
import { ComponentsFactoryService } from '../services/components-factory.service';

@Directive({
  selector: '[appDynamicFormField]',
})
export class DynamicFormFieldDirective implements DynamicFormField, OnInit {
  /**
   * The config of form field
   */
  @Input() config!: FormFieldConfig;

  /**
   * The parent form group of the form field
   */
  @Input() group!: FormGroup;
  /**
   * The options of the form field
   */
  @Input() options!: Options;

  component!: ComponentRef<DynamicFormField>;

  constructor(
    private readonly container: ViewContainerRef,
    private readonly resolver: ComponentFactoryResolver,
    private readonly componentsFactory: ComponentsFactoryService
  ) {}

  ngOnInit(): void {
    const dynamicComponent = this.componentsFactory.getFormField(
      this.config.type
    );
    const factory =
      this.resolver.resolveComponentFactory<any>(dynamicComponent);
    const component: ComponentRef<DynamicFormField> =
      this.container.createComponent(factory);
    component.instance.config = this.config;
    component.instance.group = this.group;
    component.instance.options = this.config.options || {};
  }
}
