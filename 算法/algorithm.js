/**
 * Created by abcd on 2016-4-2.
 */
var exchangeLocation = function ( pre, cur, arr ) {
	var temp = arr[pre]
	arr[pre] = arr[cur]
	arr[cur] = temp
}


//选择排序
//1.从前向后扫描, 依次确定一个index
//2.再从前向后依次比较,选择最小的放入index
var selectSort = function ( arr ) {
	for ( var i = 0, len = arr.length; i < len; i++ ) {
		for ( var j = i; j < len ; j++ ) {
			if ( arr[j] <  arr[i] ) {
				exchangeLocation( j, i ,arr )
			}
		}
	}
	return arr
}


//冒泡排序
//1.相邻元素逐个比较，交换位置
//2.从最后冒泡到最前需要 len 轮
var bubbleSort = function ( arr ) {
	for ( var i = 0, len = arr.length; i < len; i++ ) {
		for ( var j = 0; j < len; j++ ) {
			if ( arr[j+1] < arr[j] ) {
				exchangeLocation( j+1, j, arr )
			}
		}
	}
	return arr
}

//归并排序



//插入排序
//1.从前向后扫描
//2.在已排序的数组中从后向前比较    【已排序】 index  【未排序】
//3.逐个调整位置
var insertSort = function ( arr ) {
	for ( var i = 1, len = arr.length; i < len; i++ ) {
		for ( var j = i; j > 0 && arr[j] < arr[j-1]; j-- ) {
			exchangeLocation(j, j-1, arr )
		}
	}
	return arr
}


//希尔排序
//对插入排序的优化
//将插入排序的相邻比较，相邻移动，改为 间距 step 进行比较，间距 step 进行移动
//逐渐缩小间距 step, 当 step = 1 时，进行的就是插入排序了
var shellSort = function ( arr ) {
	var len = arr.length
	for ( var step = Math.floor( len / 2 ); step > 0;  step = Math.floor( step / 2 )) { //确定step
		for ( var i = step; i < len; i++ ) { //移动index,
			//j = i - step
			//arr[j-h] ，j-h为负数时，根据JavaScript特性，返回undefined ，与undefined比较返回的均是false，不影响排序
			//j > 0 ， j >= 0, =号没意义， j = 0时，j - step 对应的元素一定不存在
			for ( var j = i  ; j > 0 && arr[j] < arr[j-step] ; j -= step ) { //向后与已排序的数组部分比较
				exchangeLocation( j, j - step, arr )
			}
		}
	}
	return arr
}

//希尔排序  固定步长序列
var shellSort1 = function ( arr ) {
	//小量数据最优步长序列（维基百科）
	var stepArr = [109, 41, 19, 5, 1]
	var len = arr.length

	//遍历间隔值
	_.each( stepArr, function ( step ) {
		//遍历各个数组元素，起点不同的 有序队列
		for (var i = step ; i < len; i++ ) {
			//从后向前遍历，也正是希尔排序的优点， 靠后的元素可以较快移动到前端
			for ( var j = i ; j - step >= 0 ; j -= step ) {
				if ( arr[j] > arr[j-step] ) {
					exchangeLocation( j, j - step, arr )
				}
			}
		}
	} )
	return arr
}

//归并排序（非原地）
//递归调用 将无序数组转化成两个有序数组，递归但单一元素的数组即认为有序，
//递归返回 两数组中的元素逐个与另一个数组的元素比较，将有序的结果储存在新建数组中
var mergeSort = function ( arr ) {
	if ( arr.length < 2 ) {
		return arr
	} else {
		//slice( 可以接受小数，会向上取整 ), 所以不用floor也可以, 区别：向上取整left长，向下取整right长
		var middle = Math.floor( arr.length / 2 )
		var left = arr.slice(0, middle)
		var right = arr.slice( middle )
		return merge( mergeSort( left ), mergeSort( right ) )
	}
}

var merge = function ( left, right ) {
	var result = [];

	//for没有递增index，用while更直观
	for (var leftIndex = 0, rightIndex = 0; leftIndex <  left.length &&  rightIndex < right.length ; ) {
		if ( left[leftIndex] < right[rightIndex] ) {
			result.push( left[leftIndex] )
			leftIndex++
		} else {
			result.push( right[rightIndex] )
			rightIndex++
		}
	}
	//剩下的一定是最大的
	return result.concat( left.slice( leftIndex ) ).concat( right.slice( rightIndex ) )
}

//归并排序（原地）(返回输入的数组)
// Add the arguments to replace everything between 0 and last item in the array
// 利用splice替换即可


//快速排序
//先排序， 后递归
//快排： 先整体粗略排序，在局部精确排序 ；  归并：先局部精确排序，再整体粗略排序
var quikSort = function ( arr ) {
	if ( arr.length < 2 ) {
		return arr
	} else {
		//由于splice第一个参数会向下取整，所以免去floor函数， val的取值通过数组获取， 避免了pivot为小数的情况
		var pivot =  arr.length   / 2
		var small = []
		var big = []
		var val = arr.splice( pivot, 1 )[0]

		// var pivot =  arr.length  / 2
		// var small = []
		// var big = []
		// var val = arr[pivot]
		// arr.splice( pivot, 1 )

		_.each( arr, function ( value ) {
			value < val ? small.push( value ) : big.push( value )
		} )

		return  quikSort( small ).concat( [ val ] , quikSort( big ) )
	}
}


//Fisher乱序算法

// JavaScript特点的一种乱序算法，但是会随着数组长度的增加，随机性变差
//function shuffle (array) {
//  return array.sort(function(){
//    return Math.random() - 0.5
//  })
//}

//Fisher-Yates shuffle算法
//function ___shuffle (array) {
//  var n = array.length
//  var t, i
//  while (n) {
//   // n = max - min + 1 = (array.length - 1) - 0 + 1
//    i = Math.floor(Math.random() * n--)
//    //恰恰 n-- 之后 n 为数组最后一个索引
//    //把随机后的元素归置到数组末尾
//    t = array[n]
//    array[n] = array[i]
//    array[i] = t
//  }
//  return array
//}


//返回一个新数组的Fisher-Yates乱序算法
//给新数组赋值的同时乱序操作
//???待深入理解
var shuffle = function(obj) {
	//??? 使用了关键字
	var set = isArrayLike(obj) ? obj : _.values(obj);
	var length = set.length;
	var shuffled = Array(length);
	for (var index = 0, rand; index < length; index++) {
		rand = _.random(0, index);
		//随着数组长度的增加， 进入条件的可能性越大，也就会执行越多的改变元素的位置的操作
		if (rand !== index) shuffled[index] = shuffled[rand];
		//取值顺序是一定的，赋给的位置是不一定的
		shuffled[rand] = set[index];
	}
	return shuffled;
};
