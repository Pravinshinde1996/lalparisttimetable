import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DepotSearchComponent } from './components/depot-search/depot-search.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    DepotSearchComponent,
    HeaderComponent,
    FooterComponent,
  ],
})
export class AppModule {}
