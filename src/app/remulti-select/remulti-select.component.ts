import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from "@angular/core";

@Component({
  selector: "app-remulti-select",
  templateUrl: "./remulti-select.component.html",
  styleUrls: ["./remulti-select.component.css"],
})
export class RemultiSelectComponent implements OnInit {
  @Input() items: any[] = [];

  selectedItems: any[] = [];
  dropdownOpen = false;
  filteredItems: any[] = [];
  allSelected = false;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.filteredItems = this.items;
    console.log("datapoint", this.items);
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
  }

  // Click outside for hide options
  @HostListener("document:click", ["$event"])
  onClickOutside(event: any) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }
}
