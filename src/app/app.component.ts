import { AfterContentInit, Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicComponents, FormConfig } from './models/form-items.model';
import defaultConfig from './default-config';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  jsonSymbol = `{ ; }`;
  htmlSymbol = `< / >`;
}
