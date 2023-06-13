import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Observer, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProvincesService {
  private API_URL = environment.provinces_url;
  constructor(private http: HttpClient) {}

  getDataProvinces(): Observable<any> {
    return this.http.get<any>(this.API_URL).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  getDataDistrict(provinceValue: number): Observable<any> {
    console.log(provinceValue);
    return this.http
      .get<any>(this.API_URL + 'p/' + provinceValue + '?depth=2')
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }
  getDataWard(districtValue: number): Observable<any> {
    console.log(districtValue);
    return this.http
      .get<any>(this.API_URL + 'd/' + districtValue + '?depth=2')
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }
}
