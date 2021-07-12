const CACHE_ELEMENTS = [
    './', 
    'https://unpkg.com/react@17/umd/react.development.js',
    'https://unpkg.com/react-dom@17/umd/react-dom.development.js',
    'https://unpkg.com/@babel/standalone/babel.min.js', 
    './style.css',
    './components/Contador.js', 
    './index.js'
]

const CACHE_NAME = 'v1_cache_contador_react';

//Primer evento del serviceWorker installing
//install es la primera parte del ciclo de vida del serviceWorker
const self = this;
self.addEventListener('install', (e) => {
    //wainUntil espera a que se ejecute caches 
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            cache.addAll(CACHE_ELEMENTS).then( () => {
                self.skipWaiting()
            }).catch(error => console.log(error))
        })
    )
});

self.addEventListener('activate', (e) => {
    const cacheWhitelist = [CACHE_NAME];
    //wainUntil espera a que se ejecute caches 
    e.waitUntil(
        caches.keys().then(cacheNames =>{
            return Promise.all(cacheNames.map(cacheName => {
                return cacheWhitelist.indexOf(cacheName) === -1 && caches.delete(cacheName)
            }))
        })
        .then( () => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => {
            if(res){
                return res;
            }
            return fetch(e.request);
        })
    );
});

