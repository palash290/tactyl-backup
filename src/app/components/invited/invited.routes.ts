import { Routes } from '@angular/router';

export const invitedRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./invited-main/invited-main.component').then(m => m.InvitedMainComponent),
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('../individual/individual-dashboard/individual-dashboard.component').then(m => m.IndividualDashboardComponent),
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
                path: 'task-management',
                loadComponent: () =>
                    import('../team/tasks-management/tasks-management.component').then(m => m.TasksManagementComponent),
            },
            {
                path: 'task-details',
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
            },
            {
                path: 'view-board',
                loadComponent: () =>
                    import('../team/boards/view-board/view-board.component').then(m => m.ViewBoardComponent),
            },
            {
                path: 'view-team-member',
                loadComponent: () =>
                    import('../team/teams-management/team-overview/settings/view-team-member/view-team-member.component').then(m => m.ViewTeamMemberComponent),
            },
            {
                path: 'team-requests',
                loadComponent: () =>
                    import('../invited/team-requests/team-requests.component').then(m => m.TeamRequestsComponent),
            },
            {
                path: 'tactyl-compass',
                loadComponent: () =>
                    import('../team/tactyl-compass/tactyl-compass.component').then(m => m.TactylCompassComponent),
            },
            {
                path: 'view-notes',
                loadComponent: () =>
                    import('../team/notes/view-notes/view-notes.component').then(m => m.ViewNotesComponent),
            },
        ],
    },
];