---
title: 用python爬取网页内容
date: 2018-08-06 08:30:44
tags:
descript: 用python实现爬取网页内容的小程序
---
# 引入各种模块
代码如下:

```python
from bs4 import BeautifulSoup
import requests
import re
import threading
import csv
import os,time,random
```

如果`import`下有红色的波浪线,则是因为改模块未安装,需要通过`pip install 模块名`进行安装.

# 获取网页内容
用`requests`模块中的`get(网址)`函数来获取网页内容  
并用`encoding`设置接收内容的编码格式  

代码如下:
```python
url = "https://mp.weixin.qq.com/s/aMxcnG7pd5C3H-6LRzgwcg"
r = requests.get(url)
r.encoding = "utf-8"
```

# 对内容进行整理

## 处理接收到的内容  

接收内容,并通过`BeautifulSoup`处理接收内容.  
[更多关于`BeautifulSoup`的使用内容][1]
```python
html = r.text
# 'html.parser'意思是html解析器,还有'lxml'--lxml解析器,'html5lib'--html5lib解析器等
soup = BeautifulSoup(html,'html.parser') 
```
## 查找title标签的中的内容  

通过`get_text()`函数,可以直接获取title标签中的内容
如:
```html
<title>我是标题<title>
```

通过`get_text()`则返回`我是标题`这一字符串.  

代码如下:

```python
soup.title.get_text()
```
## 查找所有P标签

通过`find_all()`函数可以获取所有P标签,并返回一个由 **html对象** 组成的数组(不是字符串,切记)

```python
soup.find_all(`p`)

#[<p class="profile_meta"><label class="profile_meta_label">微信号</label><span class="profile_meta_value">zzuweixin</span></p>,
#<p class="profile_meta"><label class="profile_meta_label">功能介绍</label><span class="profile_meta_value">郑州大学官方微信公众平台</span></p>, 
# <p style="text-align: center;letter-spacing: 0.5px;line-height: 1.75em;"><span style="color: #595959;">泽厚万物 和合有为</span></p>, <p style="text-align: c#enter;letter-spacing: 0.5px;line-height: 1.75em;"><span style="color: #595959;"> 夏日的郑大校园渲染了青#春的色彩</span></p>]
```
### 查看P标签中是否包含图片

因为该站的图片放在P标签中,所以要把图片部分筛选出来,并通过获取图片地址,将图片保存在本地文件夹中

代码如下:
```python
pic_all = soup.find_all('img')
if pic_all:
    for pic in pic_all:
        #用当前时间戳给图片命名
        filename = str(int(time.time()))+".jpg"
        #将html对象装换为字符串,为了获取图片地址
        pstr = str(pic)
        #search是匹配任意位置的字符串,match是从头匹配,开头如果没有,直接返回none
        img_src = re.search(r'(https[^"]+)', pstr).groups()[0]
        r = requests.get(img_src,stream=True)
        with open('d/img/'+filename, 'wb') as img_f:
                for chunk in r.iter_content():
                    img_f.write(chunk)

```

或者:
```python
img_bs = con.find_all("img")
            for img_single in img_bs:
                filename = str(int(time.time()))+str(i)+'.jpg'
                #img的"data-src"属性值是图片地址,img_src接收到的是一个字符串
                img_src = img_single['data-src']
                r = requests.get(img_src,stream=True)
                with open('d/img/'+filename, 'wb') as img_f:
                    for chunk in r.iter_content():
                        img_f.write(chunk) 
```
### 将P标签中的内容提取出来

代码如下:
```python
p = soup.find_all('p')
p_content = ""
for p_one in p:
    p_content += p_one.get_text()
```

## 将爬去的内容存储到文件中

假设所有内容都放到了一个名为`data`的字典里,`title`属性是页面标题,`content`属性是页面内容  
代码如下:  
```python
with open('new.txt','wb') as f:
    f.write(data['title'])
    f.write(data['content'])
```

大致做法就是如此


完整代码如下:

```python
#!python3
# -*- coding: UTF-8 -*-
from bs4 import BeautifulSoup
import requests
import re
import threading
import csv
import os,time,random

def get_data(link):
    url = link
    r = requests.get(url)
    r.encoding = "utf-8"
    # pattern = re.compile(r'\/\/[\w]*\/')
    # dirn = pattern.findall(url)
    # print(dirn)
    # cur_dir = 'D:/python_web'
    # folder_name = dirn
    # if os.path.isdir(cur_dir):
    #     os.mkdir(os.path.join(cur_dir, folder_name))
    html = r.text
    soup = BeautifulSoup(html,'html.parser')
    p = soup.find_all('p')
    data = {}
    data["title"] = soup.title.get_text()+'\n'
    data['content'] = ""
    i = 0
    for con in p:
        if con.find_all("img"):
            img_bs = con.find_all("img")
            for img_single in img_bs:
                filename = str(int(time.time()))+str(i)+'.jpg'
                #img_sstr = str(img_single)
                #img_src = re.search(r'(https[^"]+)', img_sstr).groups()[0]
                img_src = img_single['data-src']
                print(type(img_src))
                print(img_src)
                print('正在保存图片'+img_src)
                r = requests.get(img_src,stream=True)
                with open('d/img/'+filename, 'wb') as img_f:
                    for chunk in r.iter_content():
                        img_f.write(chunk) 
                print('已保存到img文件夹下,名为:'+filename)
                data['content'] = data['content'] + '<img src="./img/' + filename + '">' + '<br>'
                i = i+1
                time.sleep(1)
        else:
            tcon = con.get_text(strip=True)
            data['content'] = data['content'] +tcon+'<br>'
    return data
    # with open("d/ptext.html","w",encoding='utf-8') as f:#文件写入
    #     f.write(data['title'])
    #     f.write(data['content'])


def write_rows(path,headers,data):
    with open(path , "a+", encoding="gb18030" , newline="") as f:
        f_csv = csv.DictWriter(f,headers)
        f_csv.writeheader()
        f_csv.writerows(data)

def main():
    url = "https://mp.weixin.qq.com/s/aMxcnG7pd5C3H-6LRzgwcg"
    filename = 'qq.csv'
    data = []
    data.append(get_data(url))
    top = ['title','content']
    write_rows(filename,top,data)
    
if __name__ == "__main__":
    main()
```

[1]