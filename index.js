// register a FetchEvent listener
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

// return custom request
async function handleRequest(request) {
  let urls;

  // fetch array of urls
  await fetch("https://cfw-takehome.developers.workers.dev/api/variants")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      urls = data;
    });

  // select url at random (A/B testing)
  let index;
  Math.random() < 0.5 ? index = 0 : index = 1;

  // return response to randomly selected url
  return await fetch(urls.variants[index]).then((response) => {
    return response;
  });
}
