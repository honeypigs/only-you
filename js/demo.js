function Paging(content,footer,maxONum, flag){
    this.maxONum = maxONum;//一页中最多多少条评论
    this.content = content.children;//评论的集合
    if (flag && this.content[this.content.length - 1].className == 'page_bottom') {
        var arr = [];
        for(var s = 0; s < this.content.length - 1; s++) {
            arr.push(content.children[s]);
        }
        this.content = arr;
    }
    this.num = Math.ceil(this.content.length/maxONum);//总共分多少页
    this.footer = footer.children;//按钮的集合
    this.focusPage = 1;//当前处于哪一页
    this.hidden();
}
Paging.prototype = {
    constructor:Paging,
    getPageNum:function(target){//获取并且计算总共有多少页
        var xhr = ajaxObject.createXhr(),
            maxONum = this.maxONum,
            allNum;
        ajaxObject.GET(xhr,target,function(){
            allNum = xhr.responseText;
            this.num = Math.ceil(allNum/maxONum);
        })
    },
    dispaly:function(value){//按钮的隐藏
        var arr = this.footer,//按钮的集合
            num = this.num,//总共分多少页
            len = arr.length,
            value = value || 1;
        if(value == 1){
            arr[0].className = "hidden";
            arr[1].className = "hidden";
        }
        if(!num||num == 1){//没有评论&&评论只有一页的时候
            for(var i = 0;i < len;i++){
                arr[i].className = "hidden";
            }
            return;
        }else if(num > 5){
            for(var i = 2;i < len-2;i++){
                arr[i].className = "show";
                arr[i].value = i - 1;
                arr[i].id = "";
            }
            arr[value + 1].id = "focus";
            return;
        }
        for(i = 2;i < len - 2;i++){
            arr[i].id = "";
            arr[i].value = i - 1;
            arr[i].className = "show";
        }
        for(i = num + 2;i < len - 2;i++){
            arr[i].className = "hidden";
        }
        arr[value + 1].id = "focus";
    },
    click:function(e){
        var that = this,
            arr = that.footer,//按钮的集合
            num = that.num,//总共分多少页
            length = arr.length,
            target = e.target || e,
            value = parseInt(target.value) || e,
            index = indexOf(arr,target);
        that.lastFocusPage = that.focusPage;
        that.focusPage = value;
        that.showLi(that.focusPage);
        arr[length - 1].className = "show";
        arr[length - 2].className = "show";
        arr[0].className = "show";
        arr[1].className = "show";
        if(value == 1){
            arr[0].className = "hidden";
            arr[1].className = "hidden";
        }else if(value == num){
            arr[length - 1].className = "hidden";
            arr[length - 2].className = "hidden";
        }
        if(value < 5){
            that.dispaly(value);
        }else{
            for(var i = 2,j = -2;i < length - 2;i++,j++){
                if(value + j <= num){
                    arr[i].className = "show";
                    arr[i].value = value + j;
                    arr[i].id = "";
                    if(value + j == value){
                        arr[i].id = "focus";
                    }
                }else{
                    arr[i].className = "hidden";
                }
            }
        }
    },
    mclick:function(oFooter){
        var that = this,
            target,
            arr = that.footer,
            length = arr.length,
            index;
        eventHandler.live(oFooter,oFooter.children,"click",function(e){
            target = e.target,
                index = indexOf(arr,target);
            if(index < 2||indexOf(arr,target) >= length - 2){
                return;
            }
            that.click(e);
        })
    },
    sclick:function(oFooter){
        var that = this,
            target,
            arr = that.footer,
            length = arr.length,
            index;

        eventHandler.live(oFooter,oFooter.children,"click",function(e){
            target = e.target;
            if(!target.value){
                target.value = target.textContent.replace(/\s/g,"");
            }
            console.log(target.value);
            switch(target.value){
                case "<<":
                    that.click(1);
                    break;
                case ">>":
                    that.click(that.num);
                    break;
                case "<":
                    if(that.focusPage == 0) that.focusPage = 1;
                    that.click(that.focusPage - 1);
                    break;
                case ">":
                    if(that.focusPage == that.num) that.focusPage = that.num - 1;
                    that.click(that.focusPage + 1);
                    break;
            }

        })
    },
    GET:function(target,page){
        var xhr = ajaxObject.createXhr();
        json = ajaxObject.encode({"page":page})
        ajaxObject.GET(xhr,target,function(){
            //
        },page)
    },
    showLi:function(focusPage){
        focusPage--;
        console.log(focusPage,this.maxONum);
        for(var i = 0;i < this.content.length;i++){
            if(i < focusPage * this.maxONum + this.maxONum&&i >= focusPage * this.maxONum){
                this.content[i].style.display = "block";
            }else{
                this.content[i].style.display = "none";
            }
        }
    },
    hidden:function(){
        for(var i = this.maxONum;i < this.content.length;i++){
            this.content[i].style.display = "none";
        }
    }
}

var eventHandler = {
	addEvent:
        function(target,type,callback,useCapture) {
            if (!target) return;
            if (!target["event" + type]) {
                target["event" + type] = {};
            }
            useCapture = useCapture || false;
            var fn = callback.toString().replace(/\s+/g,"");
            target["event" + type][fn] = handle;
            if (target.addEventListener) {
                target.addEventListener(type,handle,useCapture);
            } else if(target.attachEvent) {
                target.attachEvent("on" + type,handle);
            } else {
                target["on" + type] = handle;
            }
		function handle(event) {
			var event = event || window.event,
				preventDefault,
				stopPropagation;
			event.target = event.target || event.srcElement;
			preventDefault = event.preventDefault;
			stopPropagation = event.stopPropagation;
			event.preventDefault = function() {
				if (preventDefault) {
					preventDefault.call(event);
				} else {
					event.returnValue = false;
				}
			}
			event.stopPropagation = function() {
				if (stopPropagation) {
					stopPropagation.call(event);
				} else {
					event.cancelBubble = true;
				}
			}
			var	returnValue = callback.call(target,event);
			if (!returnValue) {
				event.preventDefault();
				event.stopPropagation();
			}
		}
	},
	removeEvent:
        function(target,type,callback,useCapture) {
            var fn = callback.toString().replace(/\s+/g,""),
                removeFn = target["event" + type][fn],
                useCapture = useCapture || false;
            if (target.removeEventListener) {
                target.removeEventListener(type,removeFn,useCapture);
            } else if(target.detachEvent) {
                target.detachEvent("on" + type,removeFn);
            } else {
                target["on" + type] = null;
            }
	},
	removeAll:
        function(target,type,useCapture) {
            var useCapture = useCapture || false,
            arr = target["event" + type];
            for(var key in arr) {
                if (target.removeEventListener) {
                    target.removeEventListener(type,arr[key],useCapture);
                } else if(target.detachEvent) {
                    target.detachEvent("on" + type,arr[key]);
                } else {
                    target["on" + type] = null;
                }
            }
	},
	live:
        function(father,child,type,callback) {
            if (!is(child,Array)) {
                var arr = [],
                    len;
                for (var i = 0,len = child.length;i < len;i++) {
                    arr.push(child[i]);
                }
            } else {
                arr = child;
            }
            this.addEvent(father,type,handle);
            function handle(e) {
                var target = e.target;
                if (indexOf(arr,target) != -1) {
                    callback.call(target,e);
                } else {
                    return;
                }
            }
	    }
}
function is(element,type) {
	return Object.prototype.toString.call(element) == "[object " + type + "]";
}
function indexOf(arr,target) {
	if (arr.indexOf) {
		return arr.indexOf(target);
	} else {
		var len;
		for(var i = 0,len = arr.length;i < len;i++){
			if (arr[i] == target) {
				return i;
			} else if(i == len-1) {
				return -1;
			}
		}
	}
}
function forEach(arr,fn) {
	if (arr.forEach) {
		arr.forEach(function(item,index,array) {
			fn(item,index,array);
		})
	} else {
		var len = arr.length;
		for (var i = 0;i < len;i++) {
			fn(arr[i],i,arr);
		}
	}
}
var ajaxObject = {
	createXhr:function() {
		if (window.XMLHttpRequest) {
			return new XMLHttpRequest();
		} else if(window.ActiveXObject) {
			return new ActiveXObject(Microsoft.XMLHTTP);
		}
	},
	encode:function(json) {
		var arr = [];
		for (var key in json) {
			arr.push(encodeURIComponent(key) + "=" + encodeURIComponent(json[key]));
		}
		return arr.join("&");
	},
	GET:function(xhr,target,callback,string) {
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status >= 200 && xhr.status < 300||xhr.status == 304) {
					callback(xhr.responseText);
				} else {
					return;
				}
			}
		}
		if (string) {
			xhr.open("GET",target + "?" + string,true);
		} else {
			xhr.open("GET",target,true);
		}
		xhr.send(null);
	},
	POST:function(xhr,string,target,callback) {
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status >= 200 && xhr.status < 300||xhr.status == 304) {
					callback(xhr.responseText);
				} else {
					return;
				}
			}
		}
		xhr.open("POST",target,true);
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xhr.send(string);
	},
    POST1:function(xhr,string,target,fn){
        xhr.open("POST",target,false);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        xhr.send(string);
        fn();
    }
}
cookieObject = {
	set:function(name,value,expiress,path,domain,secure) {
		var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
		if (expiress instanceof Date) {
			cookieText += "; expiress=" + expiress.toGMTSting();
		}
		if (path) {
			cookieText += "; path=" + path;
		}
		if (domain) {
			cookieText += "; domain" + domain;
		}
		if (secure) {
			cookieText += "; secure";
		}
		document.cookie = cookieText;
	},
	get:function(name) {
		var cookie = document.cookie,
			cookieStart = cookie.indexOf();
	},
	unset:function() {}
}
function nodeFor(node) {
	var element,
		arr;
	element =  node.firstChild;
	arr = [];
	while (element) {
		arr.push(element);
		arguments.callee.call(this,element);
		element = element.nextSibling;
	}
	return arr;
}
function anlyDomain() {
    var result = [];
    var domain = window.location.hostname.toString().split('.');
    var length = domain.length;
    result = window.location.href.toString().match(new RegExp("(?=["+ domain[length - 1] + "])\\w+(\\/((\\w*)\\/*)*)(index?)"));
    if (result == null) result = ['', '/welcome/2015/'];
    return result[1];
}
var animation = {
	move:function(target,json,speed,callback) {//1.target目标2.json需求变化3.变化的速度4.动画完成后回调
		var timeScal = 1000/60,
			count = speed/timeScal,
			floorCount = Math.floor(count),
			counting = 0,
			timer,
			oldValue,
			distance,
			finalValue;
		if (!target.animation_final || !target.animation_old || !target.animation_distance) {
			target.animation_final = {};
			target.animation_old = {};
			target.animation_distance = {};
		}
		for (var key in json) {
			target.animation_final[key] = parseFloat(json[key]);
			if (key == "opacity"&&!target.addEventListener) {
				target.animation_old[key] = parseFloat(target.filters.alpha.opacity);
				target.animation_distance[key] = (parseFloat(json[key])*100 - parseFloat(target.animation_old[key]))/count;
			} else {
				target.animation_old[key] = parseFloat(getStyle(target,key));
				target.animation_distance[key] = (parseFloat(json[key]) - parseFloat(target.animation_old[key]))/count;
			}		
		}
		if(!target.timer) {
			target.timer = setInterval(function() {
				for(key in json){
					if (key == "opacity") {
						if (!target.addEventListener) {
							oldValue = target.animation_old[key];
							distance = target.animation_distance[key];
							target.filters.alpha.opacity = (oldValue + distance);
							target.animation_old[key] = oldValue + distance;
						} else {
							oldValue = target.animation_old[key];
							distance = target.animation_distance[key];
							target.style[key] = oldValue + distance;
							target.animation_old[key] = oldValue + distance;
						}
					} else {
						oldValue = target.animation_old[key];
						distance = target.animation_distance[key];
						target.style[key] = oldValue + distance + "px";
						target.animation_old[key] = oldValue + distance;
					}
				}
				counting++;
				if (counting == floorCount) {
					for (key in json) {
						target.style[key] = json[key];
					}
					clearInterval(target.timer);
					target.timer = null;
					callback&&callback();
				}
			},timeScal)
		}
	},
	stop:function(target) {
		clearInterval(target.timer);
		target.timer = null;
	}
	
}

function Carousel(width,speed) {
    if (!this instanceof Carousel) {
        return new Carousel(width,speed);
    }
    this.elementArray = [];
    this.callbackElementArray = [];
    this.count = 0;
    this.width = width;
    this.speed = speed || 5000;
    this.timer = null;
    this.callbackAction = null;//哪个小点处于激活状态

}
Carousel.prototype = {
    constructor:Carousel,
    start:function() {
        this.timer = setTimeout(bind(this.left,this),this.speed);
    },
    pushElement:function(fatherNode) {
        var childNode = fatherNode.children;
        for(var i = 0;i < childNode.length;i++){
            this.elementArray.push(childNode[i]);
        }
    },
    pushcallbackElement:function(fatherNode) {
        var childNode = fatherNode.children;
        for(var i = 0;i < childNode.length;i++){
            this.callbackElementArray.push(childNode[i]);
            childNode[i].children[0].number = i;
        }
        this.callbackAction = this.callbackElementArray[0];
    },
    left:function() {
        var arr = this.elementArray;
        width = this.width;
        if(this.count == arr.length - 1){
            forEach(arr,function(item,index,array){
                constant(item,{"left":index*width + ""},200);
            })
            this.count = 0;
        } else {

            forEach(arr,function(item,index,array) {
                constant(item,{"left":parseInt(item.style.left) - width},200);
            });
            this.count++;
        }
        !!this.callbackElementArray[0]&&this.callBack();
        this.timer = setTimeout(bind(this.left,this),this.speed);
    },
    stop:function() {
        if(this.timer) clearTimeout(this.timer);
    },
    callBack:function() {
        this.callbackAction.className = "";
        this.callbackAction = this.callbackElementArray[this.count];
        this.callbackAction.className = "action";
    },
    click:function(num) {
        this.stop();
        var count = num,
            width = this.width,
            arr = this.elementArray;
        forEach(arr,function(item,index,array) {
            constant(item,{"left":(index - count) * width + ""},200);
        })
        this.count = num;
        if (this.callbackElementArray.length > 1) {
            this.callBack();
        }
        this.start();
    }
}

function getStyle(target,style) {
	if(window.getComputedStyle) {
		return window.getComputedStyle(target,null)[style];
	} else {
		return target.currentStyle[style];
	}
}


function bind(fn,context,ag) {
	return function() {
		fn.call(context,ag)
	}
}


function constant(target,json,speed,callback) {
	var timeScale = 1000 / 60,
		count = speed / timeScale,
		begin;

	if(target.timer) {
		clearTimeout(target.timer);
	}

	//设初值
	for(var key in json) {
		if(window.getComputedStyle) {
			begin = parseFloat(window.getComputedStyle(target,null)[key]);
		} else {
			begin = parseFloat(target.currentStyle[key]);
		}
		target[key] = (json[key] - begin) / count;
	}

	target.timer = setInterval(function() {
		var oldValue,newValue;
		var stop = true;
		for(var key in json) {
			//运动算法
			if(window.getComputedStyle) {
				oldValue = parseFloat(window.getComputedStyle(target,null)[key]);
			} else {
				oldValue = parseFloat(target.currentStyle[key]);
			}

			if(oldValue != json[key]) {
				stop = false;
			}

			if(target.addEventListener && Math.abs(oldValue - json[key]) < 1) {
				target.style[key] = json[key] + "px";
			} else if(!target.addEventListener &&  Math.abs(oldValue - json[key]) < 25) {
				target.style[key] = json[key] + "px";
			} else {
				newValue = oldValue + target[key];
				target.style[key] = newValue + "px";
			}
		}

		if(stop) {
			clearInterval(target.timer);
			typeof callback == "function" && callback();
		}

	},timeScale);
}





