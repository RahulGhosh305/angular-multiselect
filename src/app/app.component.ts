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
    const divisionIds = selectedItems.map((item) => item.id);
    if (divisionIds.length) {
      this.getDistricts(divisionIds.join(","));
    }
  }

  onDistrictChange(selectedItems: any[]) {
    const districtIds = selectedItems.map((item) => item.id);
    if (districtIds.length) {
      this.getUpazilas(districtIds.join(","));
    }
  }

  onUpazilaChange(selectedItems: any[]) {
    const upazilaIds = selectedItems.map((item) => item.id);
    if (upazilaIds.length) {
      this.getThanas(upazilaIds.join(","));
    }
  }

  onThanaChange(selectedItems: any[]) {
    const thanaIds = selectedItems.map((item) => item.id);
    if (thanaIds.length) {
      this.getWards(thanaIds.join(","));
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
