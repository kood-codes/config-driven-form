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
import { mapDependentItems, registerFormControl } from '../../helpers/form-helpers';
import {
  FormGroupConfig,
  FormItem,
  Hideable,
} from '../../models/form-items.model';

@Component({
  selector: 'app-dynamic-array',
  templateUrl: './form-array.component.html',
})
export class DynamicFormArrayComponent implements OnInit, OnDestroy {
  /**
   * The config of the form group
   */
  @Input() config!: FormGroupConfig & Hideable;
  /**
   * The parent formgroup
   */
  @Input() group!: FormGroup;

  constructor(private readonly visibilityService: VisibilityService) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {}
}
