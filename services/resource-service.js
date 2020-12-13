import { Response } from "../utils/Response";
import { HttpClientServiceInstance } from "./http-client";
import { APMAN_CORE_URL } from "./service-common";

/**
 * yeni kaynak tanımı eklenir..
 */
export async function AddResource(resourceContract) {
  var url = APMAN_CORE_URL + "/core/addresource";
  var ro = new Response();

  await HttpClientServiceInstance.post(url, resourceContract)
    .then((response) => {
      if (response.success) {
        ro.value = response.data.value;
      } else {
        ro.addCoreResults(response.results);
      }
    })
    .catch((err) => {
      console.log(err);
    });

  return ro;
}

export async function GetAllResources(filterContract) {
  var url = APMAN_CORE_URL + "/core/getallresource";
  var ro = new Response();

  await HttpClientServiceInstance.post(url, filterContract)
    .then((response) => {
      if (response.data && response.data.success) {
        ro.value = response.data.value;
      }
    })
    .catch((err) => {
      console.log(err);
      ro.addResult("aksiyon listesi getirilemedi.");
    });

  return ro;
}
