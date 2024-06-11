// RemultiSelectComponent
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  forwardRef,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
@Component({
  selector: "app-remulti-select",
  templateUrl: "./remulti-select.component.html",
  styleUrls: ["./remulti-select.component.css"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RemultiSelectComponent),
      multi: true,
    },
  ],
})
export class RemultiSelectComponent implements OnInit, OnChanges {
  @Input() items: any[] = [];
  @Input() reset: boolean = false;
  @Output() selectionChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() clearSelection: EventEmitter<void> = new EventEmitter<void>(); // New event emitter

  selectedItems: any[] = [];
  dropdownOpen = false;
  filteredItems: any[] = [];
  allSelected = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(selectedItems: any[]): void {
    this.selectedItems = selectedItems || [];
    this.onChange(this.selectedItems);
  }

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.filteredItems = this.items;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.items && !changes.items.firstChange) {
      this.filteredItems = this.items;
    }

    // Reset selected items when reset input is changed to true
    if (changes.reset && changes.reset.currentValue) {
      setTimeout(() => {
        this.selectedItems = [];
        this.allSelected = false;
        this.selectionChange.emit(this.selectedItems);
        this.onChange(this.selectedItems);
      });
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  isSelected(item: any): boolean {
    return this.selectedItems.includes(item);
  }

  onItemChange(item: any, event: any) {
    if (event.target.checked) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems = this.selectedItems.filter((i) => i !== item);
    }
    this.allSelected = this.selectedItems.length === this.items.length;
    this.selectionChange.emit(this.selectedItems);
    this.onChange(this.selectedItems);

    // Emit clearSelection event if all items are deselected
    if (this.selectedItems.length === 0) {
      this.clearSelection.emit();
    }
  }

  filterItems(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredItems = this.items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm)
    );
  }

  onSelectAllChange(event: any) {
    if (event.target.checked) {
      this.selectedItems = [...this.items];
    } else {
      this.selectedItems = [];
    }
    this.allSelected = event.target.checked;
    this.selectionChange.emit(this.selectedItems);
    this.onChange(this.selectedItems);

    // Emit clearSelection event if all items are deselected
    if (this.selectedItems.length === 0) {
      this.clearSelection.emit();
    }
  }

  @HostListener("document:click", ["$event"])
  onClickOutside(event: any) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }
}
