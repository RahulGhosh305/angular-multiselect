import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LocationService {
  private apiUrl = "http://localhost:3000";

  constructor(private http: HttpClient) {}

  getDivisions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/divisions`);
  }

  getDistricts(divisionId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/districts?divisionId=${divisionId}`
    );
  }

  getUpazilas(districtId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/upazilas?districtId=${districtId}`
    );
  }

  getThanas(upazilaId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/thanas?upazilaId=${upazilaId}`);
  }

  getWards(thanaId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/wards?thanaId=${thanaId}`);
  }
}
