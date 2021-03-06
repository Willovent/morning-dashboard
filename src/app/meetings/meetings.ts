import { Component, OnInit } from '@angular/core';
import { IMeeting } from './meeting';
import { MeetingsService } from './services/meetings.service'
import { dynamic } from 'app/dynamic-component.decorator';

@dynamic('meetings')
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
