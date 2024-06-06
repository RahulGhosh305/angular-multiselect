// import { Component } from "@angular/core";

// @Component({
//   selector: "app-root",
//   templateUrl: "./app.component.html",
//   styleUrls: ["./app.component.css"],
// })
// export class AppComponent {
//   title = "angular-chartjs";
//   divisions = [
//     { name: "Division 1" },
//     { name: "Division 2" },
//     { name: "Division 3" },
//   ];
//   districts = [
//     { name: "District 1" },
//     { name: "District 2" },
//     { name: "District 3" },
//   ];
//   upazilas = [
//     { name: "Upazila 1" },
//     { name: "Upazila 2" },
//     { name: "Upazila 3" },
//   ];
//   thanas = [{ name: "Thana 1" }, { name: "Thana 2" }, { name: "Thana 3" }];
//   wards = [{ name: "Ward 1" }, { name: "Ward 2" }, { name: "Ward 3" }];

//   onSubmit() {
//     // Handle form submission logic
//   }
// }

import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LocationService } from "./location.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  filterForm: FormGroup;
  divisions: any[] = [];
  districts: any[] = [];
  upazilas: any[] = [];
  thanas: any[] = [];
  wards: any[] = [];

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService
  ) {
    this.filterForm = this.fb.group({
      division: [""],
      district: [""],
      upazila: [""],
      thana: [""],
      ward: [""],
    });
  }

  ngOnInit() {
    this.getDivisions();
    this.filterForm.get("division").valueChanges.subscribe((value) => {
      if (value) {
        console.log(value);
        this.getDistricts(value);
      }
    });
    this.filterForm.get("district").valueChanges.subscribe((value) => {
      if (value) {
        this.getUpazilas(value);
      }
    });
    this.filterForm.get("upazila").valueChanges.subscribe((value) => {
      if (value) {
        this.getThanas(value);
      }
    });
    this.filterForm.get("thana").valueChanges.subscribe((value) => {
      if (value) {
        this.getWards(value);
      }
    });
  }

  getDivisions() {
    this.locationService.getDivisions().subscribe((data) => {
      this.divisions = data;
    });
  }

  getDistricts(divisionId: string) {
    this.locationService.getDistricts(divisionId).subscribe((data) => {
      this.districts = data;
      this.filterForm.get("district").setValue("");
      this.upazilas = [];
      this.thanas = [];
      this.wards = [];
    });
  }

  getUpazilas(districtId: string) {
    this.locationService.getUpazilas(districtId).subscribe((data) => {
      this.upazilas = data;
      this.filterForm.get("upazila").setValue("");
      this.thanas = [];
      this.wards = [];
    });
  }

  getThanas(upazilaId: string) {
    this.locationService.getThanas(upazilaId).subscribe((data) => {
      this.thanas = data;
      this.filterForm.get("thana").setValue("");
      this.wards = [];
    });
  }

  getWards(thanaId: string) {
    this.locationService.getWards(thanaId).subscribe((data) => {
      this.wards = data;
      this.filterForm.get("ward").setValue("");
    });
  }

  onSubmit() {
    if (this.filterForm.valid) {
      console.log(this.filterForm.value);
    }
  }
}
