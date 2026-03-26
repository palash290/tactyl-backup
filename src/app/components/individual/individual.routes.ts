import { Routes } from '@angular/router';

export const individualRoutes: Routes = [
      {
            path: '',
            loadComponent: () =>
                  import('./individual-main/individual-main.component').then(m => m.IndividualMainComponent),
            children: [
                  {
                        path: 'dashboard',
                        loadComponent: () =>
                              import('./individual-dashboard/individual-dashboard.component').then(m => m.IndividualDashboardComponent),
                  },
                  {
                        path: 'change-password',
                        loadComponent: () =>
                              import('../shared/change-password/change-password.component').then(m => m.ChangePasswordComponent),
                  },
                  {
                        path: 'edit-profile',
                        loadComponent: () =>
                              import('../shared/edit-profile/edit-profile.component').then(m => m.EditProfileComponent),
                  },
                  {
                        path: 'my-task',
                        loadComponent: () =>
                              import('./my-task/my-task.component').then(m => m.MyTaskComponent),
                  },
                  {
                        path: 'task-details',
                        loadComponent: () =>
                              import('./my-task/my-task-details/my-task-details.component').then(m => m.MyTaskDetailsComponent),
                  },

                  {
                        path: 'task-management',
                        loadComponent: () =>
                              import('../team/tasks-management/tasks-management.component').then(m => m.TasksManagementComponent),
                  },
                  {
                        path: 'my-task-details',
                        loadComponent: () =>
                              import('../team/tasks-management/task-details/task-details.component').then(m => m.TaskDetailsComponent),
                  },

                  {
                        path: 'my-teams',
                        loadComponent: () =>
                              import('../team/teams-management/teams-management.component').then(m => m.TeamsManagementComponent),
                  },
                  {
                        path: 'team-overview',
                        loadComponent: () =>
                              import('../team/teams-management/team-overview/team-overview.component').then(m => m.TeamOverviewComponent),
                        data: { source: 'individual' }
                  },

                  {
                        path: 'my-performance',
                        loadComponent: () =>
                              import('./my-performance/my-performance.component').then(m => m.MyPerformanceComponent),
                  },
                  {
                        path: 'tactyl-compass',
                        loadComponent: () =>
                              import('../team/tactyl-compass/tactyl-compass.component').then(m => m.TactylCompassComponent),
                  },
                  {
                        path: 'boards',
                        loadComponent: () =>
                              import('../team/boards/boards.component').then(m => m.BoardsComponent),
                  },
                  {
                        path: 'view-board',
                        loadComponent: () =>
                              import('../team/boards/view-board/view-board.component').then(m => m.ViewBoardComponent),
                  },

                  {
                        path: 'phases',
                        loadComponent: () =>
                              import('../individual/individual-phases/individual-phases.component').then(m => m.IndividualPhasesComponent),
                  },

                  {
                        path: 'notes',
                        loadComponent: () =>
                              import('../team/notes/notes.component').then(m => m.NotesComponent),
                  },
                  {
                        path: 'view-notes',
                        loadComponent: () =>
                              import('../team/notes/view-notes/view-notes.component').then(m => m.ViewNotesComponent),
                  },
                  {
                        path: 'notifications',
                        loadComponent: () =>
                              import('../shared/notifications/notifications.component').then(m => m.NotificationsComponent),
                  },
                 
            ],
      },
];
