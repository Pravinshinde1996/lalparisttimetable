import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DepotSearchComponent } from './components/depot-search/depot-search.component';
import { FooterComponent } from './components/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('msrtc-bus-timetable-portal');
}
