var getComicBook = require("../comic-book.js").getComicBook;
var fs = require('fs');

getComicBook("761941306148", "00111", function(book){

	console.log(book);

	try {
		fs.mkdirSync(__dirname + "/Comics");
	}
	catch (e) {

	}

	try {
		fs.mkdirSync(__dirname + "/Comics/" + book.publisher);
	}
	catch (e) {

	}

	try {
		fs.mkdirSync(__dirname + "/Comics/" + book.publisher + "/" + book.series);
	}
	catch (e) {

	}

	try {
		fs.writeFileSync(__dirname + "/Comics/" + book.publisher + "/" + book.series + "/" + pad(book.issue.replace("#", ""), 3) + ".json", JSON.stringify(book, null, 4));
	}
	catch (e) {

	}

});

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}