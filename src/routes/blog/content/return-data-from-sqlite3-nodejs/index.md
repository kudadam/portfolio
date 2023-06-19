---
title: "JavaScript: How To Return Data From A Function In Sqlite3"
description: How to return data from a function when using Sqlite3 in node javascript
excerpt: Learn how to return data from a function in sqlite
keywords:
  - sqlite3
  - database
  - functions
category: programming
tags:
  - sqlite3
  - javascript
date: 2021-11-04
---

While trying to implement a read counter for my website this morning, I ran into a problem. The function which returned the query from the database always returned undefined.

## The Problem

```javascript
const getData = (slug) => {
	let data;
	db.serialize(() => {
		db.get("SELECT * FROM blog WHERE slug = ?", slug, (err, rows) => {
			data = rows;
		});
	});
	return data;
};

let data = getData("return-data-from-sqlite3-nodejs"); // => undefined
```

This was my code snippet. The function `getData` takes a slug as a parameter, then it searches the database to retrieve all the data for the slug. It then assigns the data to the data variable, and at the end of the function, it returns the data variable. The function without a doubt works perfectly, but when you run it, it will always return undefined.

### Why Undefined?

The reason why the function returns undefined is that, `db.get` is an asynchronous function, so the return statement will always run before the function has even completed it's work.

## The Solution

Since the `db.get` function is asynchronous, we need to find a way to make it return it's value once it has finished it's work and the solution is by using [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). So we need to wrap the whole code in a Promise and when the function finishes executing, the promise will return the results.

### Modified Code

```javascript
const getData = (slug) => {
	return new Promise((resolve, reject) => {
		db.serialize(() => {
			db.get("SELECT * FROM blog WHERE slug = ?", slug, (err, rows) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	});
};

let promise = getData("return-data-from-sqlite3-nodejs") // => Promise { <pending> }
	.then((results) => {
		console.log(results); // => { slug: 'adding-matomo-website', read_times: 1, shares: 0, likes: 0 }
	});
```

### Explanation

So basically, what we did was wrap the whole function in a Promise and pass the `rows` to `resolve` if our code run successfully, else we pass the `err` to `reject` if there were any errors.

Oh, by the way, you can get the json of how many times this blog post has been read from this url [/blog/return-data-from-sqlite3-nodejs.json](https://www.kudadam.com/blog/return-data-from-sqlite3-nodejs.json)
