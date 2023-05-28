import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  symbol: string="IBM"
  api_url: string = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="
  APIKEY: string ="demo";

  constructor(private http: HttpClient,) { }

    getDailyDataSet(): Observable<any> {
      return this.http.get<any>(
        this.api_url + this.symbol+ "&apikey=" +this.APIKEY,
        {
          observe: "response"
      }
      );
    }

    getInterDayDataSet(): Observable<any> {
      return this.http.get<any>(
        this.api_url + this.symbol+ "&interval=1min&apikey=" +this.APIKEY,
        {
          observe: "response"
      }
      );
    }
  
}
