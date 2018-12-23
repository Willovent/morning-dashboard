import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MeetingsComponent } from './meetings/meetings';
import { NextStopComponent } from './nextstop/nextStop';
import { TimeComponent } from './time/time';
import { WeatherComponent } from './weather/weather';

import { ToHours } from './meetings/pipes/meetings.toHours';
import { SchedulesToText } from './nextstop/pipes/nextStop.schedulesToText';
import { DayOfWeek } from './time/pipes/time.day-of-week';
import { MonthOfYear } from './time/pipes/time.month-of-year';
import { ReadableTime } from './time/pipes/time.readable-time';
import { WeatherToClass } from './weather/pipes/weather.weather-to-class';
import { WeatherToCloudBase } from './weather/pipes/weather.weather-to-cloud-base';

import { ChartModule } from 'angular2-chartjs';
import { DynamicComponentDirective } from './dynamic-component.directive';
import { TwitterFeedComponent } from './twitter-feed/twitter-feed.component';

@NgModule({
  declarations: [
    AppComponent,
    MeetingsComponent,
    NextStopComponent,
    TimeComponent,
    WeatherComponent,
    ToHours,
    SchedulesToText,
    DayOfWeek,
    MonthOfYear,
    ReadableTime,
    WeatherToClass,
    WeatherToCloudBase,
    DynamicComponentDirective,
    TwitterFeedComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ChartModule
  ],
  entryComponents: [
    MeetingsComponent,
    NextStopComponent,
    TimeComponent,
    WeatherComponent,
    TwitterFeedComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
