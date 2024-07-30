import http from "k6/http";
import { check, group } from "k6";

export let options = {
  stages: [{ duration: "1s", target: 1 }],
  thresholds: {
    http_req_failed: ["rate<0.0001"],
    http_req_duration: ["p(95)<300"],
    "http_req_duration{status:200}": ["p(95)<1000"],
    "http_req_duration{status:201}": ["p(95)<1000"],
  },
};

const accessEndpoint =
  "https://ecpqf3eywp.us-east-1.awsapprunner.com/api/auth/login";

const readDataEndPoint =
  "https://ecpqf3eywp.us-east-1.awsapprunner.com/api/prompts/E_ER770526/U_ER770525";

const STEP1 = "STEP_1";

export default function () {
  group(STEP1, function () {
    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const credentials = {
      username: "odin",
      password: "odin",
    };

    //Create user
    let res = http.post(accessEndpoint, JSON.stringify(credentials), headers);

    check(res, {
      "created new user": (r) => r.status === 200,
    });

    const response = res.json();
    const token = response.access_token;
    check(res, {
      "access token is define": (r) => r.access_token !== null,
    });

    res = http.get(readDataEndPoint, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    check(res, {
      "reading data": (r) => r.status === 200,
    });
  });
}
