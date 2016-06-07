export interface IMeeting {
  from: Date;
  to: Date;
  location: string;
  description: string;
  isAllDay: boolean;
}