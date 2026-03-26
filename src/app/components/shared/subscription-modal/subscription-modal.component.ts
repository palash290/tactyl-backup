import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-subscription-modal',
  imports: [CommonModule, RouterLink],
  templateUrl: './subscription-modal.component.html',
  styleUrl: './subscription-modal.component.css'
})
export class SubscriptionModalComponent {

}
