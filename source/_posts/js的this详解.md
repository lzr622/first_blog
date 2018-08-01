---
title: js的this详解
date: 2018-08-01 13:38:31
tags:
---

JS中this关键字很常见，但是它似乎变幻莫测，让人抓狂。这篇文章就来揭示其中的奥秘。

借助阮一峰老师的话：
> 它代表函数运行时，自动生成的一个内部对象，只能在函数内部使用。  

这句话看似平常，可是要非常注意三个字：`运行时`，这说明this关键字只与函数的`执行环境`有关，而与`声明环境`没有关系。也就是这个this到底代表的是什么对象要等到函数运行时才知道，有点类似函数定义时的参数列表只在函数调用时才传入真正的对象。理解了这一点对后面this关键字规律的掌握有很大帮助。

this关键字虽然会根据环境变化，但是它始终代表的是调用当前函数的那个对象。这就引出了JS中函数调用的问题。在JS中调用函数的模式可以分为4种： 
+ 方法调用模式
+ 函数调用模式
+ 构造器调用模式
+ pply调用模式  


这些模式在如何初始化关键参数this上存在差异。

# 一、方法调用模式

当函数被保存为一个对象的属性时，它就可称为这个对象的方法。当一个方法被调用时，this被绑定到这个对象上。如果调用表达式包含一个提取属性的动作（`.` 或 `[]`），那么它被称为方法调用。例如：


```javascript
var name = "window";
var obj = {
    name: "kxy",
    sayName: function() {
        console.log(this.name);
    }
};
obj.sayName();  //kxy
```

sayName函数作为对象obj的方法调用，所以函数体中的this就代表obj对象。

# 二、函数调用模式
当一个函数并非一个对象的属性时，那么它就是被当做函数来调用的。在此种模式下，this被绑定为全局对象，在浏览器环境下就是window对象。例如：


```javascript
var name = "window";
function sayName() {
    console.log(this.name);
}
sayName();
```
sayName以函数调用模式调用，所以函数体中的this代表window对象。 


# 三、构造函数模式
如果在一个函数前面加上new关键字来调用，那么就会创建一个连接到该函数的prototype成员的新对象，同时，this会被绑定到这个新对象上。这种情况下，这个函数就可以成为此对象的构造函数。例如：

```javascript
function Obj() {
    this.name = "kxy";
}
var person = new Obj();
console.log(person.name);   //kxy

```
Obj作为构造函数被调用，函数体内的this被绑定为新创建的对象person。

# 四、apply调用模式
在JS中，函数也是对象，所有函数对象都有两个方法：apply和call，这两个方法可以让我们构建一个参数数组传递给调用函数，也允许我们改变this的值。例如：

```javascript
var name = "window";
var person = {
    name: "kxy";
}
function sayName() {
    console.log(this.name);
}
sayName();    //window
sayName.apply(person);   //kxy
sayName.apply();    //window
```
当以函数调用模式调用sayName时，this代表window；当用apply模式调用sayName，并给它传入的第一个参数为person时，this被绑定到person对象上。如果不给apply传入任何参数，则this代表window。

# 结语
自此，函数调用的4种模式就都介绍完了，this的绑定规律也就是以上几种，万变不离其宗。为了简单明了的介绍4种模式，以上的例子都比较简单，那么下面就跟我一起做一个稍复杂的练习，检验下自己是否真正掌握了this绑定对象的方法吧！

```javascript
var name = "window";
function showName() {
    console.log(this.name);
}
var person1 = {
    name: "kxy",
    sayName: showName
}
var person2 = {
    name: "Jake",
    sayName: function() {
        var fun = person1.sayName;
        fun();
    }
}
person1.sayName();    
person2.sayName();    
```
首先心中时刻提醒自己this是在函数执行时被绑定的，不要被任何赋值语句打乱阵脚。

先看第一个执行语句：person1.sayName(); 首先确定这是方法调用模式，对象为person1，再看sayName被赋值为全局函数对象showName，在showName执行时，this绑定的是person1，所以结果为”kxy”。

再看第二个执行语句：person2.sayName(); 这还是方法调用模式，对象为person2，调用的是它的sayName方法。再看sayName函数体，发现函数体最终执行的函数是fun，fun是用函数调用模式调用的。而fun最终也被赋值为showName函数，因为fun是用函数调用模式调用的，所以这里的this绑定为window，结果为”window“。




怎么样，你做对了吗?