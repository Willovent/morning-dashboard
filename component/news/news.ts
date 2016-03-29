module Dashboard {
    class NewsController {
        news: string[];
        current: number;
        constructor($http: ng.IHttpService, $interval: ng.IIntervalService) {
            let getNewNews = () =>
                $http.jsonp<any>('http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=8&q=http%3A%2F%2Fnews.google.fr%2Fnews%3Fcf%3Dall%26hl%3Dfr%26pz%3D1%26ned%3Dfr%26output%3Drss&callback=JSON_CALLBACK')
                    .success((data) => {
                        this.news = data.responseData.feed.entries.map((entrie) => entrie.title);
                        this.current = 0;
                    });
            getNewNews();
            $interval(() => this.current = ++this.current % this.news.length, 10000);
            $interval(getNewNews, 1000 * 60 * 60);
        }
    }

    class TimeComponent implements ng.IComponentOptions {
        templateUrl = 'template/news.html';
        controller = ['$http', '$interval', NewsController];
    }

    angular.module('dashboard').component('news', new TimeComponent());

}