var request = require('request');
var cheerio = require('cheerio');

module.exports.getComicBook = function(mainBarcode, issueCode, cb){

	var options = {
		url: "http://www.comics.org/barcode/" + mainBarcode,
		headers: {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36"
		}
	};

	request(options, function(error, response, html){

		var $ = cheerio.load(html);

		var foundIssue = undefined;

		for (var i = 0; i < issueCode.length; i++){
			if (issueCode[0] == "0"){
				issueCode = issueCode.substring(1);
			}
		}

		issueCode = issueCode.substring(0, issueCode.length - 2);

		$('a').each(function(index){
			if ($(this).text().indexOf("#" + issueCode) != -1 && !foundIssue){
				foundIssue = $(this).attr('href');
			}
		});

		var issueOptions = {
			url: "http://www.comics.org" + foundIssue,
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36"
			}
		};

		request(issueOptions, function(error, response, html){

			$ = cheerio.load(html);

			var foundPublisher = undefined;

			$('a').each(function(index){
				if (!foundPublisher && $(this)[0].attribs.href.indexOf("publisher") != -1){
					foundPublisher = $(this).text();
				}
			});

			var book = {
				series: $('#series_name')[0].children[1].children[0].data,
				issue: $('.issue_number')[0].children[0].data,
				month: $('.right')[0].children[0].data.split("(")[1].split(")")[0],
				publisher: foundPublisher,
				price: $('#issue_price')[0].children[0].data.replace(/\s+/g, " ").substring(1),
				pages: $('#issue_pages')[0].children[0].data.replace(/\s+/g, " ").substring(1),
				frequency: $('#indicia_frequency')[0].children[0].data.replace(/\s+/g, " ").substring(1),
				date: $('#on_sale_date')[0].children[0].data.replace(/\s+/g, " ").substring(1),
				rating: $('#rating')[0].children[0].data.replace(/\s+/g, " ").substring(1),
				barcode: $('#barcode')[0].children[0].data.replace(/\s+/g, " "),
				color: $('#format_color')[0].children[0].data.replace(/\s+/g, " "),
				dimensions: $('#format_dimensions')[0].children[0].data.replace(/\s+/g, " "),
				paper_stock: $('#format_paper_stock')[0].children[0].data.replace(/\s+/g, " "),
				binding: $('#format_binding')[0].children[0].data.replace(/\s+/g, " "),
				publishing_format: $('#format_publishing_format')[0].children[0].data.replace(/\s+/g, " "),
				cover_image: $('.coverImage')[0].children[1].children[0].attribs.src.split("?")[0]
			};

			$('.credit_label').each(function(index){
				if ($(this)[0].parent.parent == $('.credits')[0] || $(this)[0].parent.parent == $('.contents')[0]){
					if ($('.credit_value')[index].children[0].data.indexOf("?") == -1){
						book[$(this)[0].children[0].data] = $('.credit_value')[index].children[0].data;
					}
				}
			});

			for (var i = 0; i < Object.keys(book).length; i++){
				if (book[Object.keys(book)[i]][book[Object.keys(book)[i]].length - 1] == " "){
					book[Object.keys(book)[i]] = book[Object.keys(book)[i]].substring(0, book[Object.keys(book)[i]].length - 1);
				}
			}

			cb(book);

		});

	});

};