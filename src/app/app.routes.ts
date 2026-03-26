import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
      {
            path: '',
            loadComponent: () => import('./components/core/landing-page/landing-page.component').then(m => m.LandingPageComponent)
      },
      {
            path: 'login',
            loadComponent: () => import('./components/core/log-in/log-in.component').then(m => m.LogInComponent)
      },
      {
            path: 'forgot-password',
            loadComponent: () => import('./components/core/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
      {
            path: 'verify-otp',
            loadComponent: () => import('./components/core/verify-otp/verify-otp.component').then(m => m.VerifyOtpComponent)
      },
      {
            path: 'reset-password',
            loadComponent: () => import('./components/core/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
      },
      {
            path: 'choose-login',
            loadComponent: () => import('./components/core/log-in/choose-login/choose-login.component').then(m => m.ChooseLoginComponent)
      },
      {
            path: 'choose-signup',
            loadComponent: () => import('./components/core/choose-signup/choose-signup.component').then(m => m.ChooseSignupComponent)
      },
      {
            path: 'single-signup',
            loadComponent: () => import('./components/core/choose-signup/single-signup/single-signup.component').then(m => m.SingleSignupComponent)
      },
      {
            path: 'verify-email',
            loadComponent: () => import('./components/core/choose-signup/single-signup/verify-email/verify-email.component').then(m => m.VerifyEmailComponent)
      },
      {
            path: 'team-signup',
            loadComponent: () => import('./components/core/choose-signup/team-signup/team-signup.component').then(m => m.TeamSignupComponent)
      },
      {
            path: 'create-team',
            loadComponent: () => import('./components/core/choose-signup/team-signup/create-team/create-team.component').then(m => m.CreateTeamComponent)
      },
      {
            path: 'invited-signup',
            loadComponent: () => import('./components/core/choose-signup/invited-signup/invited-signup.component').then(m => m.InvitedSignupComponent)
      },
      {
            path: 'join-team',
            loadComponent: () => import('./components/core/choose-signup/invited-signup/join-team/join-team.component').then(m => m.JoinTeamComponent)
      },
      {
            path: 'set-password',
            loadComponent: () => import('./components/core/choose-signup/invited-signup/set-password/set-password.component').then(m => m.SetPasswordComponent)
      },
      {
            path: 'pricing-plan',
            loadComponent: () => import('./components/shared/pricing-plan/pricing-plan.component').then(m => m.PricingPlanComponent)
      },
      {
            path: 'payment-success',
            loadComponent: () => import('./components/shared/payment-success/payment-success.component').then(m => m.PaymentSuccessComponent)
      },
      {
            path: 'payment-cancel',
            loadComponent: () => import('./components/shared/payment-cancel/payment-cancel.component').then(m => m.PaymentCancelComponent)
      },
      {
            path: 'free-trial',
            loadComponent: () => import('./components/shared/trial-page/trial-page.component').then(m => m.TrialPageComponent)
      },
      {
            path: 'complete-profile',
            loadComponent: () => import('./components/core/choose-signup/invited-signup/complete-profile/complete-profile.component').then(m => m.CompleteProfileComponent)
      },
      {
            path: 'individual',
            loadChildren: () => import('./components/individual/individual.routes').then(m => m.individualRoutes),
            canActivate: [authGuard]
      },
      {
            path: 'team',
            loadChildren: () => import('./components/team/team.routes').then(m => m.teamRoutes),
            canActivate: [authGuard]
      },
      {
            path: 'invited',
            loadChildren: () => import('./components/invited/invited.routes').then(m => m.invitedRoutes),
            canActivate: [authGuard]
      },
      // {
      //       path: 'main',
      //       loadComponent: () => import('./components/main/main.component').then(m => m.MainComponent),
      //       children: [
      //       ]
      // }
];