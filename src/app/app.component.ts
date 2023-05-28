import { Component,OnInit,ElementRef,ViewChild } from '@angular/core';
import { Chart } from "chart.js/auto";
import { StockService } from './stock.service';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild("lineCanvas3") lineCanvas3: ElementRef | undefined;
  title = 'stock-chart-API';
  lineChart: any;
  legend: any;
 dataset: any;
  timeInterval: string = "Daily";
  timeIntervalValue = 90;
  currentClosingPrice: number;
  previousClosingPrice: number;
  latestDate: any;
  gainLoss:any;
  labelDateArray =[]
  closingValues = [];
  openingValues = [];
  highValues = [];
  lowValues = [];

constructor(private service:StockService){}


  ngOnInit(): void {
    this.loadData()
  }

async loadData(){
  try {
    const data: any[] = await new Promise((resolve, reject) => {
      this.service.getDailyDataSet().subscribe(
        (response) => {
          resolve(response.body);
          this.getLatestDate(response.body,this.timeInterval).then(()=>{
            this. getCurrentClosingPrice(response.body,this.timeInterval).then(()=>{
              this.calculateGainLoss(response.body,this.timeInterval)
              this.dataSetFormatter(response.body["Time Series (Daily)"], 'days', this.timeIntervalValue)
              this.StockChart();
            })
          })

      this.dataset = response.body;
        },
        (error: any) => {
          reject(error);
        }
      );
    });

  } catch (error) {
    console.error('Error fetching items:', error);
  }
}

async getLatestDate(dataSet, timeInterval){
  var _latestDate = moment();
  var dates = Object.keys(dataSet["Time Series (" + timeInterval + ")"]).map(d => moment(d));
  console.log(dates)
  dates.forEach((date, i, a) => {
    _latestDate = (i === 0 || date.isAfter(_latestDate)) ? date : _latestDate;
  });
  this.latestDate=_latestDate;
  return _latestDate;
} 

 async getCurrentClosingPrice(dataSet, timeInterval){
  var _currentClosingPrice = dataSet["Time Series (" + timeInterval + ")"][this.latestDate.format("YYYY-MM-DD")]["4. close"];
  this.currentClosingPrice=_currentClosingPrice;
  return _currentClosingPrice;
}

calculateGainLoss(dataSet, timeInterval){
  var _previousClosingPrice = 
  dataSet["Time Series (" + timeInterval + ")"][this.latestDate.subtract(1, "days").format("YYYY-MM-DD")]["4. close"];
  var data = (this.currentClosingPrice - _previousClosingPrice).toFixed(2);
  this.gainLoss = data
}

dataSetFormatter(dataSet, dayMonthYear, value){
// cleat arraty first :) karena ada array.push
this.labelDateArray =[]
this.closingValues = [];
this.openingValues = [];
this.highValues = [];
this.lowValues = [];
  //ambil array key di map ke moment
var dates = Object.keys(dataSet).map(d => moment(d));
for(var i = dates.length - 1; i >= 0; i--){
  if(!dates[i].isSameOrAfter(moment().subtract(value, dayMonthYear))){ //buat interfal dari data
    dates.splice(i, 1);
  }
}
//buat chart label X 
dates.forEach(d => {
  this.labelDateArray.push(d.format('MMM-DD'));
})

dates.forEach(d => {
  var closingObj = {x:{},y:[]};
  closingObj.x = d;
  closingObj.y = dataSet[d.format("YYYY-MM-DD")]["4. close"];
  this.closingValues.push(closingObj.y);

  var openingObj = {x:{},y:[]};
  openingObj.x = d;
  openingObj.y = dataSet[d.format("YYYY-MM-DD")]["1. open"];
  this.openingValues.push(openingObj.y);

  var highObj = {x:{},y:[]};
  highObj.x = d;
  highObj.y = dataSet[d.format("YYYY-MM-DD")]["2. high"];
  this.highValues.push(highObj.y);

  var lowObj = {x:{},y:[]};
  lowObj.x = d;
  lowObj.y = dataSet[d.format("YYYY-MM-DD")]["3. low"];
  this.lowValues.push(lowObj.y);

});
}

setDataRange(value:any){
console.log('value: '+ value)
 this.dataSetFormatter(this.dataset["Time Series (Daily)"], 'days', value)
 this.lineChart.destroy()
this.StockChart();
}

StockChart() {
  this.lineChart = new Chart(this.lineCanvas3?.nativeElement, {
    type: 'line',
    data: {
      labels: this.labelDateArray,
      datasets: [
        {
          label: 'Closing Value',
          fill: false,
          backgroundColor: '#e67e22',
          borderColor: '#e67e22',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#e67e22',
          pointBackgroundColor: '#e67e22',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#e67e22',
          pointHoverBorderColor: '#e67e22',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.closingValues,
          spanGaps: false,
        },
        {
          label: 'Opening Value',
          fill: false,
          backgroundColor: '#7f8c8d',
          borderColor: '#7f8c8d',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#7f8c8d',
          pointBackgroundColor: '#7f8c8d',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#7f8c8d',
          pointHoverBorderColor: '#7f8c8d',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.openingValues,
          spanGaps: false,
        },
        {
          label: 'High',
          fill: false,
          backgroundColor: '#27ae60',
          borderColor: '#27ae60',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#27ae60',
          pointBackgroundColor: '#27ae60',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#27ae60',
          pointHoverBorderColor: '#27ae60',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.highValues,
          spanGaps: false,
        },
        {
          label: 'Low',
          fill: false,
          backgroundColor: '#3498db',
          borderColor: '#3498db',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#3498db',
          pointBackgroundColor: '#3498db',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#3498db',
          pointHoverBorderColor: '#3498db',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.lowValues,
          spanGaps: false,
        },
      ],
    },
  });
  this.legend = this.lineChart.legend.legendItems
  console.log(this.legend)
}

}
