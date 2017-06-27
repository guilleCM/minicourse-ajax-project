
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var street=$('#street').val();
    var city=$('#city').val();
    $greeting.text('So, you want to live at '+street+', '+city+'?')
    $body.append('<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x300&location='+street+','+city+'">');
    
    // load NYT api
        //$.getJSON es equivalente a:
        // $.ajax({
        //   dataType: "json",
        //   url: url,
        //   data: data,
        //   success: success
        // });
    var NYT_URL='https://api.nytimes.com/svc/search/v2/articlesearch.json';
    var NYT_KEY='be57cd92c57d429a9d7c9444b6452453';
    var URL=NYT_URL+'?q='+city+'&api-key='+NYT_KEY;
    $.getJSON(URL, function(data) {
        console.log(data);
        var articles = [];
        $.each(data["response"]["docs"], function() {
            var title = (this)["headline"].main;
            var link = '<a href='+(this)["web_url"]+'>'+title+'</a>';
            var parr = '<p>'+(this)["snippet"]+'</p>';
            articles.push('<li class="article">'+link+parr+'</li>');
        });
        $nytElem.html(articles.join(""));
    }).error(function(e){
        alert("Error");
    });

    // WIKIPEDIA AJAX
    var WIKI_URL='http://en.wikipedia.org/w/api.php?action=opensearch&search='+city+'&format=json&callback=wikiCallback';

    $.ajax({
        url: WIKI_URL,
        dataType: 'jsonp',
        success: function(response) {
            var articleList=response[1];

            for (var i=0; i<articleList.length; i++){
                articleStr = articleList[i];
                var url='http://en.wikipedia.org/wiki/'+articleStr;
                $wikiElem.append('<li><a href="' +url+ '">' +articleStr+ '</a></li>');
            };
        }
    });


    return false;

};

$('#form-container').submit(loadData);
