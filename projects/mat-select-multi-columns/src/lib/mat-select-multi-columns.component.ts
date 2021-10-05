import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, EventEmitter, forwardRef, HostBinding, Input, OnChanges, OnInit, Output, Self, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { ReplaySubject, Subject } from 'rxjs';

@Component({
  selector: 'cdm-mat-select-multi-columns',
  template: `
   <mat-select
            [formControl]="formControlSelect"
            (blur)="onTouched()"
            [ngStyle]="customStyle"
            [ngClass]="customClass">
    <mat-option>
        <ngx-mat-select-search [formControl]="dataFilterSelect" placeholderLabel="Buscar ..."
            noEntriesFoundLabel="Sin resultado...">
        </ngx-mat-select-search>
    </mat-option>
    <mat-select-trigger>
        {{textValue}}
    </mat-select-trigger>
    <table class="tableFixHead">
        <thead>
            <tr>
                <th *ngFor="let hed of headers">{{hed}}</th>
            </tr>
        </thead>
        <mat-option class="customRows" *ngFor="let item of filteredData | async" [value]="item[selectedValue]">
            <tr>
                <td *ngFor="let col of displayColumns">{{item[col]}}</td>
            </tr>
        </mat-option>
    </table>
</mat-select>

  `,
  styles: [
    `
    .customRows {
      display: contents;
    }

    .tableFixHead { overflow: auto; height: 100px; }
    .tableFixHead thead th { position: sticky; top: 0; z-index: 1; }

    table  { border-collapse: collapse; width: 100%; }
    th, td { padding: 8px 16px; text-align: center; }
    th     { background:#eee; }

    ::ng-deep.mat-option .mat-option-text {
        display: contents !important;
    }

    :host {
        width: 100%;
    }

    ::ng-deep.mat-select-search-panel {
      overflow-x: auto !important;
    }

    ::ng-deep.mat-select-search-panel {
      overflow-x: auto !important;
    }

    `
  ],
  providers: [{
    provide: MatFormFieldControl,
    useExisting: forwardRef(() => MatSelectMultiColumnsComponent)
  }]
})
export class MatSelectMultiColumnsComponent implements ControlValueAccessor, OnChanges, MatFormFieldControl<any> {

  static nextId: number = 0;
  stateChanges: Subject<void> = new Subject<void>();

  _focused = false;
  _initializeError = false;
  private _placeholder: string = '';
  _required = false;

  get focused(): boolean {
    return this._focused;
  }
  set focused(value: boolean) {
    this._focused = value;
    this.stateChanges.next();
  }

  get shouldPlaceholderFloat() {
    return !!this.value;
  }

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }

  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  @Input()
  get value() {
    return this.formControlSelect.value;
  }

  set value(value) {
    this.formControlSelect.setValue(value);
    this.stateChanges.next();
  }

  get errorState(): boolean {
    return this.ngControl.errors !== null && !!this.ngControl.touched;
  }

  @Input()
  set disabled(disabled) {
    this._disabled = disabled;
    disabled ? this.formControlSelect.disable() : this.formControlSelect.enable();
    this.stateChanges.next();
  }
  get disabled() {
    return this._disabled;
  }
  private _disabled = false;

  @HostBinding('attr.aria-describedby')
  describedBy: string = '';
  @HostBinding()
  id = `select-multi-columns-${++MatSelectMultiColumnsComponent.nextId}`;
  @HostBinding('class.floating')
  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }
  get empty(): boolean {
    return !this.formControlSelect.value;
  }
  //----------------
  @Input() customClass: string;
  @Input() dataSource: any[] = [];
  @Input() headers: string[] = [];
  @Input() displayColumns: string[] = [];
  @Input() selectedValue: string;
  @Input() selectedText: (item: any) => string | string;
  @Input() customStyle: any = {};
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  dataFilterSelect: FormControl = new FormControl();
  touched = false;
  onChanged!: Function;
  onTouched!: Function;
  selectedItem: any = {};
  textValue: string;
  public filteredData: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  formControlSelect = new FormControl({ value: '', disabled: this.disabled });
  constructor(@Self() public ngControl: NgControl) {

    if (ngControl) {
      this.ngControl.valueAccessor = this;
      ngControl.valueAccessor = this;
    }

    this.formControlSelect.valueChanges.subscribe((val) => {
      if (val) {
        if (this.selectedItem) {
          this.selectedItem = this.dataSource.find((a) => a[this.selectedValue] === val);
          if (typeof this.selectedText === 'string') {
            this.textValue = this.selectedItem ? this.selectedItem[this.selectedText] : '';
          } else {
            this.textValue = this.selectedText(this.selectedItem || {});
          }
        }
      }
      if (this.onChanged)
        this.onChanged(val);

    });

    this.dataFilterSelect.valueChanges
      .subscribe((val) => {
        this.onFilter.emit(val);
        const filter = (a, s) => this.displayColumns.map((col) => {
          return a[col].toLowerCase();
        }).join(' ').includes(s);
        this.filterData(filter, this.dataSource, this.dataFilterSelect, this.filteredData);
      });

  }

  writeValue(val: any) {
    if (val)
      this.formControlSelect.setValue(val);
  }

  registerOnChange(fn: any) {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  protected filterData(filter, data: any[], ctr: FormControl, filteredData: ReplaySubject<any[]>) {
    if (!data) {
      return;
    }
    // get the search keyword
    let search = ctr.value;
    if (!search) {
      filteredData.next(data.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    filteredData.next(
      data.filter((a) => filter(a, search))
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataSource && changes.dataSource.currentValue) {
      this.dataSource = changes.dataSource.currentValue;
      this.filteredData.next(this.dataSource.slice());
      if (this.formControlSelect.value) {
        this.selectedItem = this.dataSource.find((a) => a[this.selectedValue] === this.formControlSelect.value);
        if (typeof this.selectedText === 'string') {
          this.textValue = this.selectedItem[this.selectedText];
        } else {
          this.textValue = this.selectedText(this.selectedItem);
        }
      }
      if (this.onChanged)
        this.onChanged(this.formControlSelect.value);
    }
  }

  setDescribedByIds(ids: string[]): void {

  }

  onContainerClick(): void {

  }

}
