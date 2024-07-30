import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "5s", target: 20 },
    { duration: "5s", target: 50 },
    { duration: "5s", target: 10 },
  ],
  threshold: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(90) < 400", "p(95) < 1", "p(99.9) < 2000"],
  },
};

export default function () {
  let res = http.get("http://test.k6.io");
  sleep(1);
  check(res, {
    "is status 200": (r) => r.status === 200,
  });
  check(true, {
    "true is true": (value) => value === true,
  });
  http.get("https://test.k6.io/contacts.php");
  sleep(2);
  http.get("https://test.k6.io/news.php");
  sleep(2);
}
