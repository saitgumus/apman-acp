import { HttpClientServiceInstance } from "./http-client";

export async function getAllMessages() {
  var url = "http://localhost:3003/messages/getall";
  var data = {};
  await HttpClientServiceInstance.post(url, {})
    .then((response) => {
      data = response.data.value;
    })
    .catch((err) => {});

  return data;
}

export async function saveMessage(author, property, description) {
  var url = "http://localhost:3003/messages/savemessage";
  var data = { author, property, description };
  await HttpClientServiceInstance.post(url, data)
    .then((response) => {
      data = response.data;
    })
    .catch((err) => {});

  return data;
}

export async function getMessageByProperty(propertyName) {
  var url = "http://localhost:3003/messages/selectmessage";
  var data = { property: propertyName };
  await HttpClientServiceInstance.post(url, data)
    .then((response) => {
      console.log(response.data);
      data = response.data;
    })
    .catch((err) => {});

  return data;
}
