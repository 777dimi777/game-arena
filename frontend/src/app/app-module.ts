import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Home } from './pages/home/home';
import { Tournaments } from './pages/tournaments/tournaments';

@NgModule({
  declarations: [
    App,
    Home,
    Tournaments
  ],
  imports: [
  BrowserModule,
  CommonModule,
  AppRoutingModule
],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [App]
})
export class AppModule {}