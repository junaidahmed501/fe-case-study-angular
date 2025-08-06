import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// todo: use the bootstrap component decorator
// https://angular.io/guide/standalone-components#bootstrapping-standalone-components
@Component({
  selector: 'app-root',
  imports: [RouterOutlet], // todo: use a core/shared module
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SFE Tech Task';
}
