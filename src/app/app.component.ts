import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { LocationService } from "./location.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  divisions: any[] = [];
  districts: any[] = [];
  upazilas: any[] = [];
  thanas: any[] = [];
  wards: any[] = [];
  subscriptions: Subscription[] = [];

  resetDivisions: boolean = false;
  resetDistricts: boolean = false;
  resetUpazilas: boolean = false;
  resetThanas: boolean = false;
  resetWards: boolean = false;

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.getDivisions();
    this.subscribeToFormChanges();
  }

  private initializeForm() {
    this.filterForm = this.fb.group({
      division: [""],
      district: [""],
      upazila: [""],
      thana: [""],
      ward: [""],
    });
  }

  private subscribeToFormChanges() {
    this.subscriptions.push(
      this.filterForm.get("division").valueChanges.subscribe((value) => {
        if (value) {
          this.getDistricts(value);
        }
      })
    );

    this.subscriptions.push(
      this.filterForm.get("district").valueChanges.subscribe((value) => {
        if (value) {
          this.getUpazilas(value);
        }
      })
    );

    this.subscriptions.push(
      this.filterForm.get("upazila").valueChanges.subscribe((value) => {
        if (value) {
          this.getThanas(value);
        }
      })
    );

    this.subscriptions.push(
      this.filterForm.get("thana").valueChanges.subscribe((value) => {
        if (value) {
          this.getWards(value);
        }
      })
    );
  }

  getDivisions() {
    this.locationService.getDivisions().subscribe(
      (data) => {
        this.divisions = data;
        console.log("Divisions:", this.divisions);
      },
      (error) => {
        console.error("Error fetching divisions:", error);
      }
    );
  }

  getDistricts(divisionId: string) {
    this.locationService.getDistricts(divisionId).subscribe(
      (data) => {
        this.districts = data;
        console.log("Districts:", this.districts);
        this.filterForm.patchValue({
          district: "",
          upazila: "",
          thana: "",
          ward: "",
        });
        this.clearSubsequentLevels(["upazilas", "thanas", "wards"]);
      },
      (error) => {
        console.error("Error fetching districts:", error);
      }
    );
  }

  getUpazilas(districtId: string) {
    this.locationService.getUpazilas(districtId).subscribe(
      (data) => {
        this.upazilas = data;
        console.log("Upazilas:", this.upazilas);
        this.filterForm.patchValue({ upazila: "", thana: "", ward: "" });
        this.clearSubsequentLevels(["thanas", "wards"]);
      },
      (error) => {
        console.error("Error fetching upazilas:", error);
      }
    );
  }

  getThanas(upazilaId: string) {
    this.locationService.getThanas(upazilaId).subscribe(
      (data) => {
        this.thanas = data;
        console.log("Thanas:", this.thanas);
        this.filterForm.patchValue({ thana: "", ward: "" });
        this.clearSubsequentLevels(["wards"]);
      },
      (error) => {
        console.error("Error fetching thanas:", error);
      }
    );
  }

  getWards(thanaId: string) {
    this.locationService.getWards(thanaId).subscribe(
      (data) => {
        this.wards = data;
        console.log("Wards:", this.wards);
        this.filterForm.patchValue({ ward: "" });
      },
      (error) => {
        console.error("Error fetching wards:", error);
      }
    );
  }

  onSubmit() {
    if (this.filterForm.valid) {
      console.log(this.filterForm.value);
    }
  }

  private clearSubsequentLevels(levels: string[]) {
    levels.forEach((level) => {
      this[level] = [];
    });
  }

  onDivisionChange(selectedItems: any[]) {
    if (selectedItems.length) {
      const divisionIds = selectedItems.map((item) => item.id);
      this.getDistricts(divisionIds.join(","));
    } else {
      // If all divisions are deselected, clear districts and subsequent levels
      this.districts = [];
      this.upazilas = [];
      this.thanas = [];
      this.wards = [];

      // Clear the selected values in the filter form and reset the selected items in RemultiSelectComponent
      this.filterForm.patchValue({
        district: "",
        upazila: "",
        thana: "",
        ward: "",
      });
      this.resetDistricts = true;
      this.resetUpazilas = true;
      this.resetThanas = true;
      this.resetWards = true;
    }
  }

  onDistrictChange(selectedItems: any[]) {
    if (selectedItems.length) {
      const districtIds = selectedItems.map((item) => item.id);
      this.getUpazilas(districtIds.join(","));
    } else {
      // If all districts are deselected, clear upazilas and subsequent levels
      this.upazilas = [];
      this.thanas = [];
      this.wards = [];

      // Clear the selected values in the filter form
      this.filterForm.patchValue({
        upazila: "",
        thana: "",
        ward: "",
      });

      this.resetUpazilas = true;
      this.resetThanas = true;
      this.resetWards = true;
    }
  }

  onUpazilaChange(selectedItems: any[]) {
    if (selectedItems.length) {
      const upazilaIds = selectedItems.map((item) => item.id);
      this.getThanas(upazilaIds.join(","));
    } else {
      // If all upazilas are deselected, clear thanas and subsequent levels
      this.thanas = [];
      this.wards = [];

      // Clear the selected values in the filter form
      this.filterForm.patchValue({
        thana: "",
        ward: "",
      });

      this.resetThanas = true;
      this.resetWards = true;
    }
  }

  onThanaChange(selectedItems: any[]) {
    if (selectedItems.length) {
      const thanaIds = selectedItems.map((item) => item.id);
      this.getWards(thanaIds.join(","));
    } else {
      // If all thanas are deselected, clear wards
      this.wards = [];

      // Clear the selected values in the filter form
      this.filterForm.patchValue({
        ward: "",
      });

      this.resetWards = true;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
