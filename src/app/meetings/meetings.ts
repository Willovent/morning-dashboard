import { Component, OnInit } from '@angular/core';
import { ToHours } from './pipes/meetings.toHours';
import { IMeeting } from './meeting';
import { MeetingsService } from './services/meetings.service'

@Component({
  selector: 'meetings',
  templateUrl: 'meetings.html',
  styleUrls: ['meetings.less'],
  providers: [MeetingsService]
})
export class MeetingsComponent implements OnInit {
  meetings: IMeeting[] = [];
  isLoad = false;

  constructor(private meetingsService: MeetingsService) { }

  ngOnInit() {
    this.getMeetings();
    setInterval(() => this.getMeetings(), 1000 * 60 * 60);
  }

  getMeetings() {
    this.meetingsService.getMeetings()
      .subscribe(meetings => {
        this.meetings = meetings;
        this.isLoad = true;
      });
  }
}
