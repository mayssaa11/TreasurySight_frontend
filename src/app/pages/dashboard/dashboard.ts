import { Component, OnInit } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { DecimalPipe } from '@angular/common';
import { DashboardService } from '../../services/dashboard';

@Component({
  selector: 'app-dashboard',
  imports: [NgxEchartsDirective, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  summary: any = {};
  barOptions: EChartsOption = {};
  lineOptions: EChartsOption = {};

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getDashboard(1).subscribe(data => {
      this.summary = data;

      // Bar chart
      const history = data.historiquesMensuels;
      this.barOptions = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['Encaissements', 'Décaissements'] },
        xAxis: { type: 'category', data: history.map((h: any) => h.mois) },
        yAxis: { type: 'value' },
        series: [
          { name: 'Encaissements', type: 'bar', data: history.map((h: any) => h.encaissements), color: '#1a73e8' },
          { name: 'Décaissements', type: 'bar', data: history.map((h: any) => h.decaissements), color: '#e53935' }
        ]
      };

      // Line chart
      const forecast = data.previsions;
      this.lineOptions = {
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: forecast.map((f: any) => f.date) },
        yAxis: { type: 'value' },
        series: [
          { name: 'Solde prévu', type: 'line', data: forecast.map((f: any) => f.soldePrevu), color: '#1a73e8', smooth: true }
        ]
      };
    });
  }
}