import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  imports: [CommonModule, FontAwesomeModule],
  standalone: true,
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
//`

export class SpinnerComponent {
  faSpinner = faSpinner;
  @Input() size: number = 25;
  @Input() show: boolean = false;
  constructor() {}

}
