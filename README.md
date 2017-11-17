#URL Shortener
A node.js project to make a URL-shortening service
---

Input a URL and receive a short key.
Use the key to be redirected to the original URL.
'www.thiswebsite.com/' + key


##Functionality:
  - Get / route - Render home page with input form
  - Post / route,  add full URL to database with corresponding short url key, return short url to user
  - For other routes, check key of URL route in db, if it exists, redirect to originalURL, else error