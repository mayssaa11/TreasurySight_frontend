import { Component, OnInit } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { Navbar } from '../../layout/navbar/navbar';
import { EChartsOption } from 'echarts';
import { DecimalPipe, CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard';

interface DashboardDTO {
  months: string[];
  cashIn: number[];
  cashOut: number[];
  balance: number[];
  isForecast: boolean[];
  table: CategoryRow[];
}

interface Item {
  label: string;
  amount: number;
  date: string;
  type?: string;
}

interface SubCategoryRow {
  subCategory: string;
  values: number[];
  items?: Item[]; // optional for now
}

interface CategoryRow {
  category: string;
  values: number[];
  subCategories: SubCategoryRow[];
  expanded?: boolean; // UI state
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Navbar, NgxEchartsDirective, DecimalPipe, CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  summary: any = {};       // aggregated summary for all months
  chartOptions: EChartsOption = {};
  tableData: CategoryRow[] = [];
  currentView: 'chart' | 'table' = 'chart';

  dashboardData!: DashboardDTO; // full data from backend
  selectedMonthIndex: number = 5; // default: current month
  selectedMonthData = { cashIn: 0, cashOut: 0, balance: 0 };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getDashboard(1).subscribe(dto => {
      if (!dto || !dto.isForecast) {
        console.error('Invalid dashboard data:', dto);
        return;
      }

      this.dashboardData = dto;
      this.tableData = dto.table.map((cat: any) => ({
        ...cat,
        expanded: false
      }));
      
      // Select the last past month as default (first forecast comes after it)
      const firstForecastIndex = dto.isForecast.findIndex((f: boolean) => f === true);
      const lastPastIndex = firstForecastIndex > 0 ? firstForecastIndex - 1 : 0;      
      this.selectMonth(lastPastIndex);

      // build chart
      this.buildChart(dto);

    }, error => {
      console.error('Failed to load dashboard:', error);
    });
  }

  buildChart(dto: DashboardDTO) {
    // Separate past/current vs future
    const pastCashIn = dto.cashIn.map((v, i) => dto.isForecast[i] ? null : v);
    const pastCashOut = dto.cashOut.map((v, i) => dto.isForecast[i] ? null : v);

    this.chartOptions = {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['Encaissements', 'Décaissements', 'Trésorerie'] },
      xAxis: { type: 'category', data: dto.months },
      yAxis: { type: 'value' },
      series: [
        {
          name: 'Encaissements',
          type: 'bar',
          data: pastCashIn,
          barWidth: 25,
          itemStyle: { color: '#22c55e' }
        },
        {
          name: 'Décaissements',
          type: 'bar',
          barWidth: 25,
          data: pastCashOut,
          itemStyle: { color: '#F44336' }
        },
        {
          name: 'Trésorerie',
          type: 'line',
          data: dto.balance,
          smooth: true,
          lineStyle: { width: 3, color: '#1a73e8' },
          itemStyle: { color: '#1a73e8' }
        }
      ]
    };
  }

  // Call this when a user selects a month (from a dropdown or button)
  selectMonth(index: number) {
    this.selectedMonthIndex = index;

    if (!this.dashboardData) return;

    this.selectedMonthData = {
      cashIn: this.dashboardData.cashIn[index],
      cashOut: this.dashboardData.cashOut[index],
      balance: this.dashboardData.balance[index]
    };

    // Optional: log for debug
    console.log(
      `Month: ${this.dashboardData.months[index]},`,
      this.selectedMonthData
    );
  }

}