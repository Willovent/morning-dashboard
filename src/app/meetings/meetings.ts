import { Component, OnInit } from '@angular/core';
import { ToHours } from './pipes/meetings.toHours';
import { IMeeting } from './meeting';
import { MeetingsService } from './services/meetings.service'

@Component({
  moduleId: module.id,
  selector: 'meetings',
  templateUrl: 'meetings.html',
  styleUrls: ['meetings.css'],
  pipes: [ToHours],
  providers: [MeetingsService]
})
export class Meetings implements OnInit{
  meetings: IMeeting[] = [];
  isLoad: boolean = false;

  constructor(private meetingsService: MeetingsService) { }

  ngOnInit(){
    this.getMeetings();
    setInterval(this.getMeetings, 1000* 60 * 60 );
  }

  getMeetings(){
    this.meetingsService.getMeetings()
    .subscribe(meetings => {
      this.meetings = meetings;
      this.isLoad = true;
    });
  }
}