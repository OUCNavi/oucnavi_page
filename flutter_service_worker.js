'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "52e54579ae2dcb8ff0be15a3942321df",
"splash/img/light-2x.png": "c1212395cbc9f515d1b2842b0f4b1d81",
"splash/img/dark-4x.png": "1b597558a10b01afed0863cbe80e0850",
"splash/img/light-3x.png": "470b89847b9e0a24464ea544a5c1d2ca",
"splash/img/dark-3x.png": "470b89847b9e0a24464ea544a5c1d2ca",
"splash/img/light-4x.png": "1b597558a10b01afed0863cbe80e0850",
"splash/img/dark-2x.png": "c1212395cbc9f515d1b2842b0f4b1d81",
"splash/img/dark-1x.png": "1d67b29e3c5176490daf52b6e9eb0a20",
"splash/img/light-1x.png": "1d67b29e3c5176490daf52b6e9eb0a20",
"splash/splash.js": "123c400b58bea74c1305ca3ac966748d",
"splash/style.css": "e269bb3a42ddbae94978ce6e8b90c26c",
"index.html": "da024ced0d3d7329cf066876a79d5ed3",
"/": "da024ced0d3d7329cf066876a79d5ed3",
"main.dart.js": "43ff9184296486698b39fac2a143d6e7",
"flutter.js": "f85e6fb278b0fd20c349186fb46ae36d",
"favicon.png": "69bbae4ddea57e2efb6ee527d6deada4",
"icons/flutter-Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-192.png": "f19377b09954ba94a29cb695f92dff11",
"icons/Icon-maskable-192.png": "00df56054b495f10a9bfa84f23b33757",
"icons/flutter-Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/flutter-Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-512.png": "0c5937461f1fa7e42a090cbc3a4315fb",
"icons/Icon-512.png": "cd8edd0139bf11a113f129eb6e7befb6",
"icons/flutter-Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"manifest.json": "625bbe892441edd4e08cd12662f3585e",
"assets/AssetManifest.json": "0752480a3255abb72caeb45392937e92",
"assets/NOTICES": "e5076a3835930df486fc7627e43e28a8",
"assets/FontManifest.json": "3f27c9741b8fbe23d7ff9f69ea0ac4c2",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/shaders/ink_sparkle.frag": "06e5dc81c490dcedeb37e82bdb393d5c",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/assets/images/icon.png": "06d005521987e4bc86d21808b3499b07",
"assets/assets/images/icon_adaptive.png": "06d005521987e4bc86d21808b3499b07",
"assets/assets/images/splash_logo.png": "0a40cd884203eced65add621e3cd9f36",
"assets/assets/json/timetable.json": "aca80704e6ccc114db6e4001026deb36",
"assets/assets/fonts/MyIcons.ttf": "eb49c637e12561da387381456148dc06",
"assets/assets/fonts/Noto_Sans_JP/NotoSansJP-Regular.otf": "ecfed48e463db4e31d1691c8af367730",
"assets/assets/fonts/Noto_Sans_JP/NotoSansJP-Medium.otf": "d6c74d39a44c519ff736ac55e5d28a46",
"assets/assets/fonts/Noto_Sans_JP/NotoSansJP-Light.otf": "137761c9e4b05edc375b06c256e9b65a",
"assets/assets/fonts/Noto_Sans_JP/NotoSansJP-Thin.otf": "e2b92248795c0cd02d9858aaf2a12ec2",
"assets/assets/fonts/Noto_Sans_JP/NotoSansJP-Bold.otf": "e463c4b3a2d7fbfb917831767da8c24f",
"assets/assets/fonts/Noto_Sans_JP/NotoSansJP-Black.otf": "5ce4631ec833cd0011936d5653fbd144",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
