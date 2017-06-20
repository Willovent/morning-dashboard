import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
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

import { NextStopService } from './nextstop/services/nextStop.service';
import { MeetingsService } from './meetings/services/meetings.service';
import { WeatherService } from './weather/services/weather.service';

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
    WeatherToCloudBase
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
