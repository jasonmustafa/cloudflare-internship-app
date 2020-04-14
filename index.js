// rewrites HTML elements
class ElementHandler {
  // sets correct variant (for button color and custom text)
  constructor(index) {
    this.variant = index + 1;
  }

  element(element) {
    // incoming HTML element
    if (element.tagName === 'title') {
      element.replace('<title>Hacked!</title>', { html: true });
    } else if (element.tagName === 'h1') {
      element.replace(
        '<h1 id="title" class="text-lg leading-6 font-medium text-gray-900">I have taken over your webpage! >:D</h1>',
        { html: true }
      );
    } else if (element.tagName === 'p') {
      if (this.variant === 1) {
        element.replace(
          '<p id="description" class="text-sm leading-5 text-gray-500">This is my custom Variant 1</p>',
          { html: true }
        );
      } else {
        element.replace(
          '<p id="description" class="text-sm leading-5 text-gray-500">This is my custom Variant 2</p>',
          { html: true }
        );
      }
    } else if (element.tagName === 'a') {
      if (this.variant === 1) {
        element.replace(
          '<a class="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150 sm:text-sm sm:leading-5" href="https://www.jasonmustafa.com/" id="url">Visit my portfolio!</a>',
          { html: true }
        );
      } else {
        element.replace(
          '<a class="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-green-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-indigo transition ease-in-out duration-150 sm:text-sm sm:leading-5" href="https://www.jasonmustafa.com/" id="url">Visit my portfolio!</a>',
          { html: true }
        );
      }
    }
  }
}

// register a FetchEvent listener
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

// return custom request
async function handleRequest(request) {
  let urls;

  // fetch array of urls
  await fetch('https://cfw-takehome.developers.workers.dev/api/variants')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      urls = data;
    });

  let index;

  // check if user has already seen one variant with cookies
  const cookie = request.headers.get('cookie');

  if (cookie && cookie.includes('variant=variant1')) {
    index = 0;
  } else if (cookie && cookie.includes('variant=variant2')) {
    index = 1;
  } else {
    // select URL at random (A/B testing)
    index = Math.random() < 0.5 ? (index = 0) : (index = 1);
  }

  // set response to randomly selected url or variant saved in cookies
  let res = await fetch(urls.variants[index]).then((response) => {
    return response;
  });

  // duplicate response to modify headers with new cookie
  res = new Response(res.body, res);
  res.headers.append('Set-Cookie', `variant=variant${(index + 1).toString()}; path=/`);

  // return response with HTMLRewriter
  return new HTMLRewriter().on('*', new ElementHandler(index)).transform(res);
}
