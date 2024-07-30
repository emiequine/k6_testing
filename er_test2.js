import http from "k6/http";
import { check, group, sleep } from "k6";
import { Counter, Trend } from "k6/metrics";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";
import { SharedArray } from "k6/data";

export let options = {
  stages: [{ duration: "2s", target: 10 }],
  thresholds: {
    // Corrected here
    http_req_failed: ["rate<0.0001"], // Maximum 0.01% of requests should fail
    http_req_duration: ["p(95)<200"], // 95% of requests should be under 200ms
    http_reqs: ["count>4"],
    http_reqs: ["rate>1"],
    vus: ["value>1"],
    my_counter: ["count>10"],
    response_time_news_page: ["p(95)<200"],
    er_image_home_page: ["p(95)<200"],
    "group_duration{group:::equine page}": ["p(95)<200"], // when extractring data out of the group use ::: its the 3rd column
  },
  cloud: {
    projectID: 3707082,
  },
};

let myCounter = new Counter("my_counter");
let newsPageResponseTrend = new Trend("response_time_news_page");
let er_imageTrend = new Trend("er_image_home_page");
const usersCredentials = new SharedArray("users credentials", function () {
  return JSON.parse(open("./users.json")).users;
});

console.log(usersCredentials);
export default function () {
  group("k6 page", function () {
    //get request time for this point only
    usersCredentials.forEach((user) => {
      console.log(user);
      let res = http.get(`${__ENV.BASE_URL}/news.php`);
      newsPageResponseTrend.add(res.timings.duration);
      sleep(randomIntBetween(1, 5));
    });
  });
}
