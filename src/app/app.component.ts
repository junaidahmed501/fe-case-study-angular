import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatToolbarModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = environment.appName;
}
