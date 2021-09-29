import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigFormComponent } from './containers/config-form/config-form.component';
import { DynamicFormFieldDirective } from './directives/dynamic-form-field.directive';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DynamicTextComponent } from './components/text.component';
import { DynamicTextAreaComponent } from './components/textarea.component';
import { DynamicGroupComponent } from './containers/group/form-group.component';
import { DynamicDateInputComponent } from './components/date.component';
import { DynamicNumberInputComponent } from './components/number.component';
import { MatNativeDateModule } from '@angular/material/core';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { DynamicSelectComponent } from './components/select.component';
import { DynamicCheckboxComponent } from './components/checkbox.component';
import { DynamicRadioComponent } from './components/radio.component';
import { DynamicButtonComponent } from './components/button.component';
import { DynamicFormArrayComponent } from './containers/form-array/form-array.component';
import { ConfigGeneratorComponent } from './containers/config-generator/config-generator.component';
import { ConfigPlaygroundComponent } from './containers/config-playground/config-playgroud.component';
import { ConfigStateService } from './services/config-state.service';

const uiModules = [
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatButtonModule,
  MatSelectModule,
  MatCheckboxModule,
  MatRadioModule,
  MatIconModule,
  MatSlideToggleModule,
  CodemirrorModule,
];
const components = [
  DynamicFormFieldDirective,
  DynamicTextComponent,
  DynamicTextAreaComponent,
  DynamicGroupComponent,
  DynamicFormArrayComponent,
  DynamicNumberInputComponent,
  DynamicDateInputComponent,
  DynamicSelectComponent,
  DynamicCheckboxComponent,
  DynamicRadioComponent,
  DynamicButtonComponent,
  ConfigGeneratorComponent
];

@NgModule({
  declarations: [AppComponent, ConfigFormComponent, ConfigPlaygroundComponent, ...components],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ...uiModules,
  ],
  providers: [ConfigStateService],
  bootstrap: [AppComponent],
})
export class AppModule {}
