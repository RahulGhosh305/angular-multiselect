import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from "./app.component";

import { FilterFormComponent } from "./filter-form/filter-form.component";
import { MultiSelectComponent } from "./multi-select/multi-select.component";
import { RemultiSelectComponent } from './remulti-select/remulti-select.component';

@NgModule({
  declarations: [AppComponent, FilterFormComponent, MultiSelectComponent, RemultiSelectComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    FormsModule, // Import FormsModule here
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
