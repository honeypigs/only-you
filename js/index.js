(function(){//轮播
    var b = document.getElementsByTagName("ul")[0],
        a = new Carousel(708,2000);
    a.pushElement(b);
    a.start();
 })();