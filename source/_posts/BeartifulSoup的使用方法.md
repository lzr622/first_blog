---
title: BeautifulSoup的使用方法
date: 2018-08-07 09:04:33
tags: python
description: BeautifulSoup的安装及使用
---

# BeautifulSoup的基本介绍

简单来说，BeautifulSoup是python的一个库，最主要的功能是从网页抓取数据。官方解释如下：

> Beautiful Soup提供一些简单的、python式的函数用来处理导航、搜索、修改分析树等功能。它是一个工具箱，通过解析文档为用户提供需要抓取的数据，因为简单，所以不需要多少代码就可以写出一个完整的应用程序。
>
> Beautiful Soup自动将输入文档转换为Unicode编码，输出文档转换为utf-8编码。你不需要考虑编码方式，除非文档没有指定一个编码方式，这时，Beautiful Soup就不能自动识别编码方式了。然后，你仅仅需要说明一下原始编码方式就可以了。Beautiful Soup已成为和lxml、html6lib一样出色的python解释器，为用户灵活地提供不同的解析策略或强劲的速度。  

# BeautifulSoup的安装

通过`pip install + 模块名`来安装
```python
pip install beautifulsoup4
```
如果直接使用的话,使用的是默认的html解析器,
也可以选择安装 **lxml** 解析器
```python
pip install lxml
```

也可以安装纯python实现的 **html5lib** 解析器
```python
pip install html5lib  
```

**如果被解析的HTML文档是标准格式,那么这几种解析器之间没有任何差别,只是解析速度不同,结果都会返回正确的文档树.**

|解析器|使用方法|优势|劣势|
|:----:|:----:|:----:|:----:|
|python标准库|BeautifulSoup(markup, “html.parser”)|Python的内置标准库执行,速度适中,文档容错能力强|文档容错能力差|
|lxml HTML 解析器|BeautifulSoup(markup, “lxml”)|速度快,文档容错能力强|需要安装C语言库|
|lxml XML 解析器|BeautifulSoup(markup, [“lxml”, “xml”])BeautifulSoup(markup, “xml”)|速度快,唯一支持XML的解析器|需要安装C语言库|
|html5lib|BeautifulSoup(markup, “html5lib”)|最好的容错性,以浏览器的方式解析文档,生成HTML5格式的文档|速度慢,不依赖外部扩展|

# 开始使用

安装完毕后,我们现在就可以开始试着去使用它了

## 创建一个BeautifulSoup4对象

我们在开始使用BeautifulSoup4之前,先写一段html代码,以后就以它为对象进行操作
```python
html = """
<html><head><title>The Dormouse's story</title></head>
<body>
<p class="title" name="dromouse"><b>从前有座山,</b></p>
<p class="story"> 山里有座庙,
<a href="http://1test1.com/elsie" class="sister" id="link1"><!-- Elsie --></a>,
<a href="http://2test2.com/lacie" class="sister" id="link2">老monk </a> and
<a href="http://3test3.com/tillie" class="sister" id="link3">小monk </a>;
庙里有个老和尚,</p>
<p class="story"> 在给小和尚讲故事 </p>
</body>
</html>
"""
```

首先引入bs4模块
```python  
from bs4 import BeautifulSoup
```

创建BeautifulSoup对象

```python
soup = BeautifulSoup(html)
```

如果是个 **文件** 可以这样
```python
soup = BeautifulSoup(open("index.html"))
```

下面我们用`soup.prettify()`来打印一下 soup 对象的内容，格式化输出
```python
print(soup.prettify())
```

结果为:
```
D:\python\lib\site-packages\bs4\__init__.py:181: UserWarning: No parser was explicitly specified, so I'm using the best available HTML parser for this system ("lxml"). This usually isn't a problem, but if you run this code on another system, or in a different virtual environment, it may use a different parser and behave differently.

The code that caused this warning is on line 20 of the file test.py. To get rid of this warning, change code that looks like this:

 BeautifulSoup(YOUR_MARKUP})

to this:

 BeautifulSoup(YOUR_MARKUP, "lxml")

  markup_type=markup_type))
<html>
 <head>
  <title>
   The Dormouse's story
  </title>
 </head>
 <body>
```
## 四大对象种类

Beautiful Soup将复杂HTML文档转换成一个复杂的树形结构,每个节点都是Python对象,所有对象可以归纳为4种:
- Tag
- NavigableString
- BeautifulSoup
- Comment

### 种类一:Tag

就是HTML中的标签如:
```html
<title>story</title>
```
其中Tag就是  `title`

我们来具体操作一下
下面每一段代码中注释部分即为运行结果
```python
title = soup.title
# <title>The Dormouse's story</title>
# <class 'bs4.element.Tag'>
```


操作P标签

```python
p = soup.p
# <p class="title" name="dromouse"><b>从前有座山,</b></p>
# <class 'bs4.element.Tag'>
```
操作a标签

```python
a = soup.a
# <a class="sister" href="http://1test1.com/elsie" id="link1"><!-- Elsie --></a>
#<class 'bs4.element.Tag'>
```

不过这样都只能获取第一个该类型的标签,如何获取全部的标签可以使用`find_all()`函数
```python
p_all = soup.find_all('p')
# [<p class="title" name="dromouse"><b>从前有座山,</b></p>, <p class="story"> 山里有座庙,<a class="sister" href="http://1test1.com/elsie" id="link1"><!-- Elsie --></a>,<a class="sister" href="http://2test2.com/lacie" id="link2">老monk </a> and<a class="sister" href="http://3test3.com/tillie" id="link3">小monk </a>;庙里有个老和尚,</p>, 
# <p class="story"> 在给小和尚讲故事 </p>]
#<class 'bs4.element.ResultSet'>
```

Tag有两个重要的属性:
- name
- attrs

**name**

```python
print(soup.name)
print(soup.p.name)
#[document]  <class 'str'>
# p  <class 'str'>
```
soup 对象本身比较特殊，它的 name 即为 `[document]`，对于其他内部标签，输出的值便为标签本身的名称。

**attrs**

```python
print(soup.p.attrs)
#{'class': ['title'], 'name': 'dromouse'}
#<class 'dict'>
```

如果我们想要单独获取某个属性值，可以这样，例如我们获取它的 class的值
```python
print(soup.p['class'])
# ['title']
#<class 'list'>
```

还可以这样，利用get方法，传入属性的名称，二者是等价的
```python
print(soup.p.get("class"))
# ['title']
#<class 'list'>
```
我们可以对这些属性和内容等等进行修改，例如
```python
soup.p['class']="newClass"
print soup.p
#<p class="newClass" name="dromouse"><b>从前有座山,</b></p>
#<class 'bs4.element.Tag'>
```

### 种类二:NavigableString

如果想取标签中的文字应该怎么做呢,直接加一个`string`或`get_text()`就行,结果可以直接和字符串连接
```python
print(soup.p.string)
# 从前有座山,
# <class 'bs4.element.NavigableString'>
```

### 种类三:BeautifulSoup

BeautifulSoup 对象表示的是一个文档的全部内容.大部分时候,可以把它当作 Tag 对象，是一个特殊的 Tag，我们可以分别获取它的类型，名称，以及属性
```python
print type(soup.name)
#<type 'unicode'>
print soup.name 
# [document]
print soup.attrs 
#{} 空字典
```

### 种类四:Comment

Comment 对象是一个特殊类型的 NavigableString 对象，其实输出的内容仍然不包括注释符号，但是如果不好好处理它，可能会对我们的文本处理造成意想不到的麻烦。

我们找一个带注释的标签

```python
print soup.a
print soup.a.string
print type(soup.a.string)

# <a class="sister" href="http://example.com/elsie" id="link1"><!-- Elsie --></a>
# Elsie 
# <class 'bs4.element.Comment'>
```

a 标签里的内容实际上是注释，但是如果我们利用 .string 来输出它的内容，我们发现它已经把注释符号去掉了，所以这可能会给我们带来不必要的麻烦。

另外我们打印输出下它的类型，发现它是一个 Comment 类型，所以，我们在使用前最好做一下判断，判断代码如下(需要在文件开头加上`import bs4`,不然会显示`bs4.element.Comment中的 bs4 未定义`)
```python
if type(soup.a.string)!=bs4.element.Comment:
    print (soup.a.string)
else:
    print("这是注释")
# 这是注释
```
上面的代码中，我们首先判断了它的类型，是否为 Comment 类型，然后再进行其他操作，如打印输出等。




以上内容就是BeautifulSoup4相关的入门操作,如果想了解更多,请点击

<a href="http://beautifulsoup.readthedocs.io/zh_CN/latest/" class="last_a">官方文档</a>


<style>

.last_a {
    display: inline-block;
    padding: 5px 10px;
    background-color: #00a67c;
    color: white;
    border-radius: 2px;
    -webkit-transition-duration: .4s

}
.last_a:hover {
    background-color: #f60;
    color: white;
    text-decoration: none;
}
</style>