import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, EventEmitter, forwardRef, HostBinding, Input, OnChanges, OnInit, Output, Self, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { MatFormFieldAppearance, MatFormFieldControl } from '@angular/material/form-field';
import { ReplaySubject, Subject } from 'rxjs';

@Component({
  selector: 'cdm-mat-select-search',
  template: `
        <mat-select [placeholder]="placeholder" [formControl]="formControlSelect" [ngStyle]="customStyle"
        [ngClass]="customClass" (blur)="onTouched()">
        <mat-option>
            <ngx-mat-select-search [formControl]="dataFilterSelect" placeholderLabel="Buscar ..."
                noEntriesFoundLabel="Sin resultado...">
            </ngx-mat-select-search>
        </mat-option>
        <mat-select-trigger>
            {{textValue}}
        </mat-select-trigger>
        <mat-option class="customRows" *ngFor="let item of filteredData | async" [value]="item[selectedValue]">
            {{getText(item)}}
        </mat-option>
    </mat-select>

  `,
  styles: [
    `
    :host {
      width: 100%;
    }
  `
  ],
  providers: [{
    provide: MatFormFieldControl,
    useExisting: forwardRef(() => MatSelectSearchComponent)
}]
})
export class MatSelectSearchComponent implements OnInit, ControlValueAccessor, OnChanges, MatFormFieldControl<any> {

  static nextId: number = 0;
  stateChanges: Subject<void> = new Subject<void>();

  private _focused = false;
  private _placeholder: string = '';
  private _required = false;

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
  id = `search-mat-select-${++MatSelectSearchComponent.nextId}`;
  @HostBinding('class.floating')
  get shouldLabelFloat(): boolean {
      return this.focused || !this.empty;
  }
  get empty(): boolean {
      return !this.formControlSelect.value;
  }
  //--------
  @Input() customClass: string;
  @Input() dataSource: any[] = [];
  @Input() filterColumns: string[] = [];
  @Input() selectedValue: string;
  @Input() selectedText: (item: any) => string | string;
  @Input() customStyle: any = {};
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  dataFilterSelect: FormControl= new FormControl();
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
              const filter = (a, s) => this.filterColumns.map((col) => {
                  return a[col].toLowerCase();
              }).join(' ').includes(s);
              this.filterData(filter, this.dataSource, this.dataFilterSelect, this.filteredData);
          });

  }

  ngOnInit() {

  }

  writeValue(val: any) {
      if (val)
          this.formControlSelect.setValue(val, { emitEvent: false });
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

  getText(item) {
      if (typeof this.selectedText === 'string') {
          return item[this.selectedText];
      } else {
          return this.selectedText(item);
      }
  }

  setDescribedByIds(ids: string[]): void {

  }

  onContainerClick(): void {

  }

}
