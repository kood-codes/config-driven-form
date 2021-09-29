import { AfterContentInit, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicComponents, FormConfig } from '../../models/form-items.model';
import defaultConfig from '../../default-config';
import { BehaviorSubject } from 'rxjs';
import { ConfigStateService } from 'src/app/services/config-state.service';

@Component({
  selector: 'app-config-playground',
  templateUrl: './config-playgroud.component.html',
})
export class ConfigPlaygroundComponent implements OnInit, AfterContentInit{
  form = new FormGroup({});
  codeMirrorOptions = {
    lineNumbers: true,
    theme: 'material',
    mode: { name: 'javascript', typescript: true },
  };
  @ViewChild('formOutlet', { read: ViewContainerRef, static: true }) outletRef!: ViewContainerRef;
  @ViewChild('formTmpl', { read: TemplateRef, static: true }) contentRef!: TemplateRef<any>;

  content = this.configState.getConfig();
  // config!: FormConfig;
  config$: BehaviorSubject<FormConfig> = new BehaviorSubject(this.getConfig());

  constructor(private configState: ConfigStateService) {}

  ngOnInit(): void {
    // this.config = this.getConfig(this.configState.getConfig());
    // this.content = this.configState.getConfig();
  }

  onFormSubmit(form: FormGroup): void {
    console.log('Submitted', form.value);
  }

  onFormReset(): void {}

  private renderView(): void {
    this.outletRef.clear();
    this.outletRef.createEmbeddedView(this.contentRef);
  }

  ngAfterContentInit(): void {
    this.renderView();
  }

  getConfig(config = defaultConfig): FormConfig {
    // tslint:disable-next-line:prefer-const
    let configItem;
    // tslint:disable-next-line:no-eval
    eval(`configItem = ${this.content}`); // Using eval on purpose
    return configItem as FormConfig;
  }

  updateConfig(): void {
    this.configState.saveConfig(this.content);
    // this.config = this.getConfig(this.content);
    this.config$.next(this.getConfig(this.content));
    this.form = new FormGroup({});
    this.renderView();
  }
}
