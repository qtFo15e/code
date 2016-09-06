 /**
 * Created by abcd on 2015-11-5.
 */


//深复制   第一个参数必选
function deepcopy(origin, copy) {
    //接受数组或对象
    copy  = copy ||  (origin.constructor.toString().match(/function\s*([^(]*)/)[1] == "Array" ? [] : {})
    //不用判断origin是否为空，因为按照copy的规则 ，origin是必选参数
    //（从函数用法上，影响了函数的内部结构的定义）
    // var i in origin 可以便利origin的属性，并不会产生属性名为undefined的情况
    for (var i in origin) {
        //判断子内容是否为基本类型基本类型  具体：子内容存在 且是对象（对象或数组），但不是函数
        //注意需要用 origin[i]取属性，而不是origin.i取属性
        //因为 i 是一个保存着字符串的变量，需要用[]
        if (origin.toString() && typeof origin[i] != "function" && typeof origin[i] == "object"){
            copy[i] = deepcopy(origin[i])
        } else {
            copy[i] = origin[i]
        }
    }
    return copy;
}


////////////////////////////////////////////////////////////////////////

//数据类型判断
var class2type = {}
//原生类型
"Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function(e) {
    class2type[ "[object " + e + "]"] = e.toLowerCase()
});

function myType(obj) {
    if (obj == null) {
        return String(obj);
    }
    //   注意运算符的优先级
    return typeof obj === "object" || typeof obj === "function" ?
        //返回引用类型
    class2type[class2type.toString.call(obj)] || "object" :
        // 基本类型
        typeof  obj;
}



/////////////////////////////////////////////////////////////////////

// 扩展对象
// 思路  1.预制默认值，再判断参数  2.判断源对象的属性的类型，选择相应的数据结构 3.选择是否递归  4.返回结果
function myExtend () {
    var deep,copy,src,origin,clone,isArray
        ,target = arguments[0] || {}
        ,i = 1 // 标记|obj|的起始位置
        ,len = arguments.length
    //判断是否深扩展
    if (typeof target == "boolean") {
        deep = target;
        target = arguments[++i]
    }
    //判断目标对象类型
    if (typeof target != "object" || target == null) {
        target = {}
    }
    // 如果源对象的位置 在arguments数组外，说明没有源对象，只有目标对象
    // 则复制自身，把目标对象当做源对象
    if (len == i) {
        i--
        //target = this  不理解！！！！！！！！！！！！！！！！！！！！！
    }

    for ( ; i < len; i++ ) {
        if (origin = arguments[i] != null) {  //排除对象为空的情况
            clone = target

            for (var name in origin) {
                copy = origin[ name ]
                src = target[name]

                if (copy === target) {
                    continue
                    //  防止对象的属性指向自身
                    // var a = new Object()
                    // a.oo = a
                    //或者
                    //     var a = []
                    //     a[0] = a
                    // 每次读取|obj|的属性，属性值又回到了|obj|,无限递归下去了
                }

                if (deep && copy && (copy.isPlainObject() || (isArray =  copy.isArray()) ) ) {
                    if (isArray) {
                        isArray = false // isArray 是一个需要多次重复判断的值，所以使用后要重置
                        src = src && src.isArray() ? src : []  // 修正源属性的值
                    } else {
                        src = src && src.isPlainObject() ? src : {}
                    }
                    target[name] = myExtend(deep, src, copy)  //以自身src值得基础上进行递归扩展
                }
                else if (copy) {
                    target[name] = copy //扩展值null
                }
            }
        }
    }
    return target;
}

//////////////////////////////////////////////////////////////////////

// JavaScript精讲正则例子(有改动)  使用 {name:[]}的数据结构
function restore (myString) {
    var stringArr = myString.split("\r\n")
    var result = [];
    var flog = "top"
    stringArr.forEach(proccess)
    function proccess (string) {
        var i = {},k = {},j = []
        var temp = string.match(/^(\s)|^(;)|^\[(\w)+]$|^(\w+)=(.*)/)
        if (!temp) return;
        if (temp[2]) return;
        if (temp[3]) {
            flog = temp[3]
            return;
        }
        i[temp[4]] = temp[5]
        if (result[result.length-1] && result[result.length-1][flog]) {
            result[result.length-1][flog].push(i)
            return
        }
        j.push(i)
        k[flog] = j
        result.push(k)
    }
    return result;
}

///////////////////////////////////////////////////////////////////////

//函数memoration化  是函数具有记忆  函数——》函数 + 数据
function memory(fun) {
    var cache = {}

    return function() {
        var key = Array.prototype.join.call(arguments, ",");
        if (key in cache) return cache[key];
        else return cache[key] = fun.apply(this, arguments);
    }
}

// 示例函数
var factorial = memory(function(n) {
    return (n <= 1 ) ? 1 : n * factorial(n-1);
});

console.log(factorial(5))

///////////////////////////////////////////////////////////////////////////

// 有改动
// 模仿foreach 只接受参数 不修改object   object可以使数组或对象
//  func(index,value)
function myEach (object, func) {
    var name
        ,i = 0
        ,length = object.length
        ,isArray= length  // **********有改动

    if (isArray) {
        for ( ; i < length; i++ ) {
            if (func.call(object[i], i, object[i]) === false) break;
        }
    }
    else {
        for (name in object) {
            if (func.call(object[name], name, object[name]) === false) break;   //函数应用的环境为要操作的值
        }
    }
}

///////////////////////////////////////////////////////////////////

//一段很邪门的代码，很邪门，邪门。。。。。。

var mailArchive = {
    0: "Dear",
    1: "dsa",
    2: "wqeqwe"
}

for (var current = 0; current in mailArchive; current) {
    //////
}

/////////////////////////////////////////////////////////////
function groupCheck (s) {
    "use strict"
    var temp = [];
    return s.split("").every(function (ele, index, array) {
        if (!s) return false //排除空内容
        // 不能用 || 合并 三个条件 ，因为每个条件下又要做不同的判断
        if (ele == ")") {
            // 与栈的末尾元素比较
            if (temp[temp.length - 1 + ""] != "(")return false;
            else {temp.pop()}
        }
        if (ele == "}") {
            if (temp[temp.length - 1 + ""] != "{") {return false;}
            else {temp.pop()}
        }
        if (ele == "]") {
            if (temp[temp.length - 1 + ""] != "[") {return false;}
            else {temp.pop()}
        }
        //  特殊情况推入栈 ，其他情况不处理
        if (ele == "(" || ele == "{" || ele == "[") {temp.push(ele)}
        // 如果穷尽了 所以字符，栈中还有元素未弹出 ，说明缺少符号
        if (index == array.length - 1 && temp.length != 0) {return false}
        return true
    })
}

//  多函数组合   组合后的函数接受多个参数
function compose(f,g) {
    var arr = Array.prototype.slice.call(arguments)
    // 递归 栈的思想  先入后出   递归到最后一个才开始运算
    function func(n, can) {
        if (n == arr.length - 1) {
            return arr[n].apply(this, can)
        }
        else {
            return arr[n](func(n + 1, can))
        }
        return function () {
            return func(0, arguments)
        }
    }
}
///////////////////////////////////////////////////////
//有BUG  不能区分大小写
function duplicateCountBUG(text){
    //..
    var n = 0
    var temp = []
    // 此函数可以用循环while处理 或者 函数式方法
    // 因为每轮的操作 不需要下一轮提供数据 ，反而为下一轮提供数据
    // 类似 m = m + n  或者  reduce（function（pre,cur））
    function inner(text) {
        // 此方法注定死路了
        // (\1)会完全与(\w)相同  不能忽略大小写
        if (-1 ==text.search(/(\w)(.*)(\1)/i)) {
            return n
        } else {
            return inner(text.replace(/(\w)(.*)(\1)/i,function(a,b,c,d){
                if (-1 == temp.indexOf(b)){
                    n++
                    temp.push(b)
                    temp.push(d)
                }
                return c
            }))
        }
    }
    return inner(text)
}


////////////////////////////////////////////////////////////////////


function duplicateCount(text) {
    // 先用toLowerCase() 统一了大小写
    // slipt  sort 转换为数组 并将相同的元素排在一起  join再转回字符串
    //
    return (text.toLowerCase().split("").sort().join("").match(/([^])\1+/g) || []).length
}

//////////////////////////////////////////////////////





///////////////////////////////////////////////////////////

/*
 Description:

 The goal of this exercise is to write a method that takes two strings as parameters and returns an integer n, where n is equal to the amount of spaces "rotated forward" the second string is relative to the first string (more precisely, to the first character of the first string).

 For instance, take the strings "fatigue" and "tiguefa". In this case, the first string has been rotated 5 characters forward to produce the second string, so 5 would be returned.

 If the second string isn't a valid rotation of the first string, the method returns -1.
 Examples:

 "coffee", "eecoff" => 2

 "eecoff", "coffee" => 4

 "moose", "Moose" => -1

 "isn't", "'tisn" => 2

 "Esham", "Esham" => 0

 "dog", "god" => -1+
 */

/////////////////////////////////////////////////

// 解决思想 : 用这则表达式  /a?b?c?/ 的形式去匹配  匹配到的结果旋转部分  其余的就是支点部分
//  缺点 ： 要考虑到字符和空格对正则表达式的影响
//          由于JavaScript正则表达式中不能加判断条件，会出现只有中间部分匹配 所以还要判断截取字符串 再判断是否相等

function MYshiftedDiff(first,second){
    // ...
    var secondA = second.split("")
    // 所以特殊特殊字符  转义为字面意思
    var arr = ["^","$",".","*","+","?","=","!",":","|","\\","/","(",")","[","]","{","}",]
    secondA = secondA.map(function(ele, index){
        for(var i = 0, len = arr.length; i < len; i++){if (ele == arr[i]) return "\\" + ele}
        //解决字符串中空格字符 无法使用 ？ 重复的问题
        return ele.replace(/\s/,"\\s")
    })
    var reg = new RegExp(secondA.reduce(function(pre,cur){return pre + cur + "?"},""))
    var temp = first.match(reg)
    if (!temp) return -1
    var aa = first.slice(first.indexOf(temp[0]) + temp[0].length)
    var a =  second.slice(0,second.indexOf(temp[0]))
    if (aa != a) return -1
    return  second.indexOf(temp)
}

///////////////////////////////////////////////////////////////////////////////
//求支点部分结束的位置
//解决思想 ： 由于此类型的旋转 字符串的有两部分顺序组成  旋转部分 支点部分
//            旋转后  支点部分  旋转部分
//            相加    支点部分  （旋转部分  支点部分） 旋转部分

function shiftedDiff(first, second) {
    if (first.length != second.length) return -1
    return (second + second).indexOf(first)
}

///////////////////////////////////////////

// 也可以理解为 交换位置的问题
// 恢复到原来的位置  就可以判断交换的部分
function shiftedDiff11111111(first,second){
    if (first === second) return 0;
    var t = first.split('');
    for (var i = 1; i < second.length; ++i){
        t.unshift(t.pop());
        if (t.slice().join('') === second) return i;
    }
    return -1
}

////////////////////////////////////////////////////
/*
 getMissingElement( [0, 5, 1, 3, 2, 9, 7, 6, 4] ) // returns 8
 getMissingElement( [9, 2, 4, 5, 7, 0, 8, 6, 1] ) // returns 3
 */

//借用循环中的计数器完成操作 比较简便

function getMissingElement(superImportantArray){
    for (i = 0; i < 10; i++) {
        if (superImportantArray.indexOf(i) === -1) return i;
    }
}

//////////////////////////////////////

// 成对问题

function isValidWalk(walk) {
    //////////////----------------------------------------
    // 缺点 ： 情况多时不好解决  代码多
//    var x = 0,y = 0
//    if ( walk.length != 10) return false
//    else {
//        walk.forEach(function(item){
//            switch (item){
//                case "n": y++ ;break
//                case "s": y-- ;break
//                case "e": x++ ;break
//                case "w": x-- ;break
//            }
//        })
//        return (x == 0 && y == 0) ? true : false
//    }

    //////////////////------------------------------
    // 对成对的种类  和 数量有限制
//        return walk.length == 10 && !walk.reduce(function(w,step){ return w + {"n":-1,"s":1,"e":99,"w":-99}[step]},0)


    //////////////----------------------

    // 缺点 ： 计数问题  但修改了字符串，麻烦
    if (walk.length != 10) return false
    walk = walk.sort().join("")
    while(walk.search(/ns/g) != -1 || walk.search(/es/) != -1){
        walk = walk.replace(/ns/g,"").replace(/ew/,"")
    }
    return !walk
}



////////////////////////////////////////////////////////////////////////////////////////

//  判断回文

// 从中间切分后  再反序其中一段
//function palindrome(string) {
//    var temp, strARR = string.toLowerCase().match(/\w+/g).join("").split("")
//    tempARR = (temp = strARR.length / 2) % 1 == 0 ? [temp,temp] : [Math.floor(temp),Math.floor(temp)+1]
//    return strARR.slice(tempARR[1]).reverse().join("") == strARR.slice(tempARR[0]).join("")
//}

//正则不可以匹配回文
//function palindrome(string) {
//    return string.toLowerCase().match(/\w+/g).join("")//.search(/^(\w+)\w?\1$/) //!= -1
//}

// 用  reduce 实现  reverse的功能   用reduceRight 模拟更方便
// match A + join() 等价于 replace 非A 为""
//  设计到一个  切分偶数字符串和奇数字符串的问题   slice的第二个参数是不会被切分到的
//  偶数字符串中一个切分点 len/2 为前后的公共参数
//  奇数字符传中两个切分点 避开了中间的对称中心  Math.floor(len/2) 即为对称中心的index   Math.floor(len/2) + 1为第二段的起始点
//function palindrome(string) {
//    var temp,tempARR, strARR = string.toLowerCase().match(/\w+/g).join("").split("")
//    tempARR = (temp = strARR.length / 2) % 1 == 0 ? [temp,temp] : [Math.floor(temp),Math.floor(temp)+1] // sliced point of middle
// return cur + pre 顺序就是反过来的了
////    return strARR.slice(tempARR[1]).reduce(function(pre,cur){pre.unshift(cur); return pre},[]).join("") ==  strARR.slice(0,tempARR[0]).join("")
//}


// 还判断  旋转交换问题一样    还是用整体的思想解决问题  而不是把字符串拆分成几段
// 本质上  回文也是一个旋转问题
// 考虑问题还是留在了问题的表面  没跳出原有的情景  所以才回去切分字符串
function palindrome(string) {
    var sanitized = string.toLowerCase().replace(/^\w/g, "");
    return sanitized == sanitized.split("").reduceRight(function(sum, v) {return sum + v;});
}

/////////////////////////////////////////////////////////////////////////////////////////////////

//  判断回文

// 从中间切分后  再反序其中一段
//function palindrome(string) {
//    var temp, strARR = string.toLowerCase().match(/\w+/g).join("").split("")
//    tempARR = (temp = strARR.length / 2) % 1 == 0 ? [temp,temp] : [Math.floor(temp),Math.floor(temp)+1]
//    return strARR.slice(tempARR[1]).reverse().join("") == strARR.slice(tempARR[0]).join("")
//}

//正则不可以匹配回文
//function palindrome(string) {
//    return string.toLowerCase().match(/\w+/g).join("")//.search(/^(\w+)\w?\1$/) //!= -1
//}

// 用  reduce 实现  reverse的功能   用reduceRight 模拟更方便
// match A + join() 等价于 replace 非A 为""
//  设计到一个  切分偶数字符串和奇数字符串的问题   slice的第二个参数是不会被切分到的
//  偶数字符串中一个切分点 len/2 为前后的公共参数
//  奇数字符传中两个切分点 避开了中间的对称中心  Math.floor(len/2) 即为对称中心的index   Math.floor(len/2) + 1为第二段的起始点
//function palindrome(string) {
//    var temp,tempARR, strARR = string.toLowerCase().match(/\w+/g).join("").split("")
//    tempARR = (temp = strARR.length / 2) % 1 == 0 ? [temp,temp] : [Math.floor(temp),Math.floor(temp)+1] // sliced point of middle
// return cur + pre 顺序就是反过来的了
////    return strARR.slice(tempARR[1]).reduce(function(pre,cur){pre.unshift(cur); return pre},[]).join("") ==  strARR.slice(0,tempARR[0]).join("")
//}


// 还判断  旋转交换问题一样    还是用整体的思想解决问题  而不是把字符串拆分成几段
// 本质上  回文也是一个旋转问题
// 考虑问题还是留在了问题的表面  没跳出原有的情景  所以才回去切分字符串
function palindrome(string) {
    var sanitized = string.toLowerCase().replace(/^\w/g, "");
    return sanitized == sanitized.split("").reduceRight(function(sum, v) {return sum + v;});
}

//////////////////////////////////////////////////////////////////////////////////////////////////////



// 已知方程但不可化简，计算机不能解方程，需要制定更好的策略，用循环去试数速度慢，此方法不推荐，数学上的公式的运行速度并不一定适用于编程
// 大量的四则运算不会影响多少性能，但大量的重复运算会降低性能（减少重复运算 ， 保留之前运算结果的思想）
//具体得性能分析，还得学算法！
// 循环迭代数据时

//function findNb(m) {
//    // your code
//    var temp
//    for (var i=0; ; i++) {
//        i * (i+1) * (2 * i +1)/6
//        if (temp == m ){
//            return i;
//        } else if (temp > m) {
//            return -1;
//        }
//    }
//var n = 0
//
//    while (m > 0) {
//        m = m - Math.pow(++n, 3)
//    }
//    return m == 0 ?  n : -1
//}

function findNb(m) {
    var n = 0
    while (m > 0){
        m -= Math.pow(++n,3)
    }
    return m ? -1 : n
}


////////////////////////////////////////////////////////////




//  根据reduce的返回形式  相当于两个filter 的功能
function partitionOn(pred,itemsA) {
    var itemsTemp = itemsA.reduce(function(pre,cur){
        pred(cur) ? pre[1].push(cur) : pre[0].push(cur) ; return pre
    },[[],[]])
    items = itemsTemp[0].concat(itemsTemp[1])
    return itemsTemp[0].length
}
var items = [1, 2, 3, 4, 5, 6];
function isEven(n) {return n % 2 == 0}
var i = partitionOn(isEven, items);
console.log(items)


//function partitionOn(pred, items) {
//    var f = items.filter( function(e) { return !pred(e); } );
//    var t = items.filter(pred);
//    items.length = 0;
//    for(var i = 0; i < f.length; i++) { items.push(f[i]); }
//    for(var i = 0; i < t.length; i++) { items.push(t[i]); }
//
//    return f.length;
//
//}




/////////////////////////////////////////////////////////////


//特殊情况  "adc (asd "
//  类似"$1"短属性 直接放在引号内  在 replace中，可表示本次匹配，但不能直接进行操作 ，要在函数中操作
//  类似 RegExp.lastMatch 长属性 可以直接进行操作  直接用时代表上一次的匹配 间接用时代表的是本次的匹配 （类似以一个函数为划分）
//
function generateHashtag (str) {
    if (str.length > 140 || str.length == 0) return false
    str = str.replace(/([^\w]*)(\w)/,function(a){return RegExp.lastMatch.toUpperCase()}) //
    return "#" + str.replace(/(\s([^\w]*)(\w))(\w*)/g,function(a,b,c,d,e){return c + d.toUpperCase() + e}).replace(/\s/g,"")
}

// 去掉字符串中的空格的话  split(" ")  和 join() 组合 只要在之后操作不会因为空字符串而产生异常
// 此方法是可以去除字符串中的任意空格
// 次函数中相比正则  对字符串的处理上   数组思想代码量更少点
function generateHashtag (str) {
    return str.length > 140 || str === '' ? false :
    '#' + str.split(' ').map(capitalize).join('');
}
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/////////////////////////////////////////////////////////////////////////////


// 缓存结果  复杂参数储存问题
// 参数形式很复杂  需要更多的考虑
function MYcache(func) {
    var temp = new Object(), value
    return function (arg1, arg2) {
        value = temp[Array.prototype.slice.call(arguments).reduce(function(pre,cur){return pre + cur},"") + arguments.length]
        return  value != undefined ? value : (value = func.apply(null, arguments))
    }
}

// 把参数化为 JOSN 数据的格式  方便比较相等
function cache(func) {
    var calls = {}
    return function() {
        var key = JSON.stringify(arguments)
        if (!(key in calls)){calls[key] = func.apply(null,arguments)}
        return calls[key]
    }
}


///////////////////////////////////////////////////////////////////////////////////////

// 返回结果或函数不确定的问题
// 不能直接返回 arguments.callee  返回这个无法定义函数的具体行为
// fn利用闭包保持对add的引用，同时fn和add用一样的参数签名 两个函数相互返回调用 就像是一个函数在连续调用 形成可以连续调用的功能  是一直迭代 而不是递归 每次处理后的数据要给下一次用 从前向后调用  返回的结果也是从前给到后
// 闭包中包含的数据 没单独声明  而是直接引用的是参数变量
// add  一个是保存上次运行结果，引出fn
function add(n){
    var fn = function(x) {
        // 此处可以理解为对n的加工处理  由于只需要其本身值所以直接传入了下一层函数
        // 操作处理放在add中也可以  fn的主要作用还是建立联系
        return add(n + x)   //由于需要返回函数 所以  对上层数据和本次数据的处理在参数的位置上
    }
    fn.valueOf = function () {   // 迭代终止时的处理 利用valueOf 把上一次运算的结果返回出去
        return n;
    }
    return fn
}


/////////////////////////////////////////////////////////////////

