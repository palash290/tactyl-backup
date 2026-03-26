import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-team-performance',
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './team-performance.component.html',
  styleUrl: './team-performance.component.css'
})
export class TeamPerformanceComponent {

  chartOptions1: any;
  performanceData: any;
  performance_insights0: any;
  performance_insights1: any;
  performance_insights2: any;
  graph_data: any;
  hasGraphData = false;

  constructor(private service: CommonService) { }

  ngOnInit() {
    this.getTeams();
  }

  getTeams() {
    this.service.get('user/teams/performance').subscribe({
      next: (resp: any) => {
        this.performanceData = resp.data.team_performance;
        this.performance_insights0 = resp.data.performance_insights[0];
        this.performance_insights1 = resp.data.performance_insights[1];
        this.performance_insights2 = resp.data.performance_insights[2];
        this.graph_data = resp.data.graph_data ?? [];

        // 🚫 Remove teams with no task data
        const filteredGraphData = this.graph_data.filter(
          (t: any) =>
            Number(t.total_tasks) > 0 ||
            Number(t.completed_tasks) >= 0 ||
            Number(t.completion_rate) > 0
        );

        // If no valid data → hide chart completely
        if (!filteredGraphData.length) {
          this.chartOptions1 = null;
          this.hasGraphData = false;
          return;
        }
        this.hasGraphData = true;
        this.graph_data = filteredGraphData;

        const teamNames = filteredGraphData.map((t: any) => t.team_name);
        const completionRates = filteredGraphData.map((t: any) => t.completion_rate);
        const remainingRates = filteredGraphData.map(
          (t: any) => 100 - t.completion_rate
        );


        // const teamNames = this.graph_data.map((t: any) => t.team_name);
        // const completionRates = this.graph_data.map((t: any) => t.completion_rate);
        // const remainingRates = this.graph_data.map(
        //   (t: any) => 100 - t.completion_rate
        // );

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
            categories: teamNames
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
              const team = this.graph_data[dataPointIndex];
              return `
        <div style="padding:10px">
          <strong>${team.team_name}</strong>
          <div style="margin-top:6px">
            <span style="color:#6C63FF">●</span>
            Completion Rate <b>${team.completion_rate}%</b>
          </div>
          <div style="margin-top:4px">
            <span style="color:#6C63FF">●</span>
            Completed Tasks <b>${team.completed_tasks}</b>
          </div>
          <div style="margin-top:4px">
            <span style="color:#A5B4FC">●</span>
            Total Tasks <b>${team.total_tasks}</b>
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
