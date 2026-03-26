import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-my-performance',
  imports: [NgApexchartsModule],
  templateUrl: './my-performance.component.html',
  styleUrl: './my-performance.component.css'
})
export class MyPerformanceComponent {


  chartOptions1: any;
  performanceData: any;
  graph_data: any;
  userType: any;
  performance_insights0: any;
  performance_insights1: any;
  performance_insights2: any;

  constructor(private service: CommonService) { }

  ngOnInit() {
    this.getTeams();
  }

  getTeams() {
    this.service.get('user/performance').subscribe({
      next: (resp: any) => {
        this.performanceData = resp.data.team_performance;
        this.performance_insights0 = resp.data.performance_insights[0];
        this.performance_insights1 = resp.data.performance_insights[1];
        this.performance_insights2 = resp.data.performance_insights[2];
        this.graph_data = Array.isArray(resp.data.graph_data)
          ? resp.data.graph_data
          : [resp.data.graph_data];


        // 📊 Map API data
        const months = this.graph_data.map((m: any) => m.month);

        const completionRates = this.graph_data.map(
          (m: any) => Number(m.completion_rate)
        );

        const remainingRates = this.graph_data.map(
          (m: any) => 100 - Number(m.completion_rate)
        );


        this.chartOptions1 = {
          chart: {
            type: 'bar',
            height: 320,
            stacked: true,
            toolbar: { show: false }
          },

          series: [
            {
              name: 'Completed',
              data: completionRates
            },
            {
              name: 'Remaining',
              data: remainingRates
            }
          ],

          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '45%',
              borderRadius: 10,
              borderRadiusApplication: 'end',
              borderRadiusWhenStacked: 'last'
            }
          },

          xaxis: {
            categories: months
          },

          yaxis: {
            max: 100,
            labels: {
              formatter: (val: number) => `${val}%`
            }
          },

          colors: ['#6C63FF', '#ECEBFF'],

          grid: {
            strokeDashArray: 6
          },

          dataLabels: {
            enabled: false
          },

          legend: {
            show: false
          },

          tooltip: {
            custom: ({ dataPointIndex }: any) => {
              const monthData = this.graph_data[dataPointIndex];

              const completionRate = Number(monthData.completion_rate);
              const completedTasks = Math.round(
                (monthData.total_tasks * completionRate) / 100
              );

              return `
        <div style="padding:10px; min-width:180px">
          <strong>${monthData.month}</strong>

          <div style="margin-top:6px">
            <span style="color:#6C63FF">●</span>
            Completion Rate:
            <b>${completionRate}%</b>
          </div>

          <div style="margin-top:4px">
            <span style="color:#6C63FF">●</span>
            Completed Tasks:
            <b>${completedTasks}</b>
          </div>

          <div style="margin-top:4px">
            <span style="color:#A5B4FC">●</span>
            Total Tasks:
            <b>${monthData.total_tasks}</b>
          </div>
        </div>
      `;
            }
          }
        };




      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }


}
