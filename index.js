// global - variant

class ElementHandler {
  // sets correct variant (for button color and custom text)
  constructor(index) {
    this.variant = index + 1;
  }

  element(element) {
    // An incoming element, such as `div`
    console.log(`Incoming element: ${element.tagName}`);
    if (element.tagName === 'title') {
      element.replace('Hacked!', { html: true });
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

  comments(comment) {
    // An incoming comment
  }

  text(text) {
    // An incoming piece of text
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

  // select url at random (A/B testing)
  let index;
  Math.random() < 0.5 ? (index = 0) : (index = 1);

  // return response to randomly selected url
  const res = await fetch(urls.variants[index]).then((response) => {
    return response;
  });

  return new HTMLRewriter().on('*', new ElementHandler(index)).transform(res);
}
