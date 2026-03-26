import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-team-dashboard',
  imports: [NgApexchartsModule, RouterLink],
  templateUrl: './team-dashboard.component.html',
  styleUrl: './team-dashboard.component.css'
})
export class TeamDashboardComponent {


  chartOptions1: any;
  chartOptions2: any;
  dashboardData: any;

  constructor(private service: CommonService, private router: Router) { }

  ngOnInit() {
    this.getDashboard();
  }

  getDashboard() {
    this.service.get(`user/dashboard`).subscribe({
      next: (resp: any) => {
        this.dashboardData = resp.data;

        const performance = this.dashboardData?.performance_chart;
        const teamPerf = Array.isArray(performance?.team_performance) ? performance.team_performance : [];
        const individualPerf = Array.isArray(performance?.individual_performance) ? performance.individual_performance : [];

        const categoriesSet = new Set<string>();
        teamPerf.forEach((item: any) => categoriesSet.add(item?.month || ''));
        individualPerf.forEach((item: any) => categoriesSet.add(item?.month || ''));
        const categories = Array.from(categoriesSet).filter(Boolean);

        const teamSeries = categories.map((month) => {
          const match = teamPerf.find((item: any) => item?.month === month);
          return Number(match?.completion_rate ?? 0);
        });

        const individualSeries = categories.map((month) => {
          const match = individualPerf.find((item: any) => item?.month === month);
          return Number(match?.completion_rate ?? 0);
        });

        this.chartOptions1 = {
          chart: {
            type: 'line',
            height: 350,
            toolbar: { show: false }
          },
          series: [
            {
              name: 'Team Performance',
              data: teamSeries
            },
            {
              name: 'Individual Performance',
              data: individualSeries
            }
          ],
          xaxis: {
            categories
          },
          stroke: {
            width: 3,
            curve: 'smooth'
          },
          markers: {
            size: 4
          },
          colors: ['#4f46e5', '#10b981'],
          title: { align: 'left' }
        };

        const total = this.dashboardData.total_tasks || 0;
        const completed = this.dashboardData.completed_tasks || 0;
        const pending = this.dashboardData.pending_tasks || 0;

        this.chartOptions2 = {
          chart: {
            type: 'donut',
            height: 300,
            toolbar: { show: false }
          },
          series: [total, completed, pending],
          labels: ['Total Tasks', 'Completed', 'Pending'],
          colors: ['#4db8ff', '#3d6f4a', '#a5e3df'],
          plotOptions: {
            pie: {
              donut: {
                size: '70%',
                labels: {
                  show: true,
                  name: { show: true },
                  value: { show: true },
                  total: {
                    show: true,
                    label: 'Tasks',
                    formatter: () => total.toString()
                  }
                }
              }
            }
          },
          legend: {
            position: 'bottom',
            fontSize: '14px',
            markers: {
              width: 10,
              height: 10,
              radius: 50
            }
          },
          dataLabels: { enabled: false }
        };
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }


}
