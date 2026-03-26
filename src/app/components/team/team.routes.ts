import { Routes } from '@angular/router';

export const teamRoutes: Routes = [
      {
            path: '',
            loadComponent: () =>
                  import('./team-main/team-main.component').then(m => m.TeamMainComponent),
            children: [
                  {
                        path: 'dashboard',
                        loadComponent: () =>
                              import('./team-dashboard/team-dashboard.component').then(m => m.TeamDashboardComponent),
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
                        path: 'teams',
                        loadComponent: () =>
                              import('./teams-management/teams-management.component').then(m => m.TeamsManagementComponent),
                  },
                  {
                        path: 'team-overview',
                        loadComponent: () =>
                              import('./teams-management/team-overview/team-overview.component').then(m => m.TeamOverviewComponent),
                  },
                  {
                        path: 'view-team-member',
                        loadComponent: () =>
                              import('./teams-management/team-overview/settings/view-team-member/view-team-member.component').then(m => m.ViewTeamMemberComponent),
                  },
                  {
                        path: 'users',
                        loadComponent: () =>
                              import('./users-management/users-management.component').then(m => m.UsersManagementComponent),
                  },
                  {
                        path: 'user-details',
                        loadComponent: () =>
                              import('./users-management/user-details/user-details.component').then(m => m.UserDetailsComponent),
                  },
                  {
                        path: 'tasks',
                        loadComponent: () =>
                              import('./tasks-management/tasks-management.component').then(m => m.TasksManagementComponent),
                  },
                  {
                        path: 'task-details',
                        loadComponent: () =>
                              import('./tasks-management/task-details/task-details.component').then(m => m.TaskDetailsComponent),
                  },
                  {
                        path: 'tactyl-compass',
                        loadComponent: () =>
                              import('./tactyl-compass/tactyl-compass.component').then(m => m.TactylCompassComponent),
                  },
                  {
                        path: 'boards',
                        loadComponent: () =>
                              import('./boards/boards.component').then(m => m.BoardsComponent),
                  },
                  {
                        path: 'view-board',
                        loadComponent: () =>
                              import('./boards/view-board/view-board.component').then(m => m.ViewBoardComponent),
                  },

                                    {
                        path: 'phases',
                        loadComponent: () =>
                              import('../individual/individual-phases/individual-phases.component').then(m => m.IndividualPhasesComponent),
                  },

                  // {
                  //       path: 'team-boards',
                  //       loadComponent: () =>
                  //             import('../team/boards/boards.component').then(m => m.BoardsComponent),
                  // },
                  // {
                  //       path: 'view-team-board',
                  //       loadComponent: () =>
                  //             import('../team/boards/view-board/view-board.component').then(m => m.ViewBoardComponent),
                  // },

                  {
                        path: 'team-performance',
                        loadComponent: () =>
                              import('./team-performance/team-performance.component').then(m => m.TeamPerformanceComponent),
                  },
                  {
                        path: 'notes',
                        loadComponent: () =>
                              import('./notes/notes.component').then(m => m.NotesComponent),
                  },
                  {
                        path: 'view-notes',
                        loadComponent: () =>
                              import('./notes/view-notes/view-notes.component').then(m => m.ViewNotesComponent),
                  },
                  {
                        path: 'reports',
                        loadComponent: () =>
                              import('./reports/reports.component').then(m => m.ReportsComponent),
                  },
                  {
                        path: 'user-permissions',
                        loadComponent: () =>
                              import('./teams-management/team-overview/settings/permissions/permissions.component').then(m => m.PermissionsComponent),
                  },
                  {
                        path: 'team-requests',
                        loadComponent: () =>
                              import('../invited/team-requests/team-requests.component').then(m => m.TeamRequestsComponent),
                  },
            ],
      },
];