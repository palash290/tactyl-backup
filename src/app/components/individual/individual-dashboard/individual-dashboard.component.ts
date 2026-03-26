import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-individual-dashboard',
  imports: [NgApexchartsModule, RouterLink],
  templateUrl: './individual-dashboard.component.html',
  styleUrl: './individual-dashboard.component.css'
})
export class IndividualDashboardComponent {

  chartOptions1: any;
  dashboardData: any;
  userType: any;

  constructor(private service: CommonService) { }

  ngOnInit() {
    this.userType = localStorage.getItem('userType');
    this.getDashboard();
  }

  getDashboard() {
    this.service.get(`user/dashboard`).subscribe({
      next: (resp: any) => {
        this.dashboardData = resp.data;

        const total = this.dashboardData.total_tasks || 0;
        const completed = this.dashboardData.completed_tasks || 0;
        const pending = this.dashboardData.pending_tasks || 0;

        this.chartOptions1 = {
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
