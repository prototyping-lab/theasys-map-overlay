# Theasys Map

Demo of how to use an overlay map on top of the theasys 360 tour viewer.  
Used for the HfG Semesterausstellung in Summer 2020.  

## Hosting on Theasys.io

- See [index.html](index.html) and [landing.html](landing.html)

## Hosting locally

- See [local.html](local.html) and [landing.html](local-landing.html)
- Add your locally hosted tour to the local-tour folder.
- make sure to edit config.js so it points at the local-tour

```js
var vars = {
    file : 'index.html',
    path : 'https://YOUR-SERVER/local-tour/', //path to the index.html
    theme : 'theasys',
};
```

## License

MIT