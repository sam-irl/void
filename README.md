# void
A social network site without the social part.

## Prereqs

While most of void's dependencies can be installed with an `npm install`, void also requires a MongoDB instance. By default this runs on localhost, should you wish to modify this simply edit the files in the `databases/` folder.

## Building

Given that you have set up a MongoDB instance, installation is easy.

```
git clone https://github.com/sam-irl/void.git
cd void
npm install
npm start
```