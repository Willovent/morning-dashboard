import { Component, OnInit, Input, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { dynamic } from 'app/dynamic-component.decorator';

@dynamic('twitter-feed')
@Component({
  selector: 'app-twitter-feed',
  templateUrl: './twitter-feed.component.html',
  styleUrls: ['./twitter-feed.component.less']
})
export class TwitterFeedComponent implements OnInit {

  @Input()
  user: string;

  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    if (!this.document.querySelector('#twitter-js')) {
      const twitterJsscript = this.document.createElement('script');
      twitterJsscript.src = 'https://platform.twitter.com/widgets.js';
      twitterJsscript.id = 'twitter-js';
      const firstJs = this.document.getElementsByTagName('script')[0];
      firstJs.parentNode.insertBefore(twitterJsscript, firstJs);
    }
  }
}
