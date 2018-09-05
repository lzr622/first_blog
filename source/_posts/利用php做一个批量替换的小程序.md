---
title: 利用php做一个批量替换的小程序
date: 2018-08-16 14:09:12
tags: php
description: 利用php做一个批量替换文件中内容的小程序
---

因为在工作中,需要对一些文件所共有的大面积相同内容进行批量替换,所以写了这样一个小程序.

# 前端页面
首先我们需要先做一个前端页面方便我们传文件名和修改的内容

## 基本HTML代码
要有输入文件名,要修改的内容和修改后的内容的地方

主要HTML代码如下: 

```html
<form action="file.php" method="POST">
        文件名:
        <input type='file' name='textfield' id='textfield' />  
        <input type="text" value="" name="fn" onblur="tip()">
        <br>
        <ul id="ul">
            <li>原文:
                <input class="before" type="text" name="before[]" value="" placeholder="要替换的内容">
            </li>
            <li>替换:
                <input type="text" name="after[]" value="" placeholder="替换后的内容">
            </li>
        </ul><br>
        <br> 添加更改内容请点:
        
            <div class="add" onclick="addul()">+</div>

        <br>
        <input class="tijiao" type="submit" value="提交" id="send">
    </form>
```  

效果如下:
![效果](利用php做一个批量替换的小程序/前端.png)



## js需实现的功能和代码

js主要需要实现的功能有:

+ 可以填写文件名,并且通过ajax验证文件是否存在,文件类型是否合法(即通过后缀名判断),不存在或不合法都有所反馈
+ 可以添加需要修改的内容,初始设定为一处修改,可通过点击`add`添加为多处修改

```html
    <script>
        function addul() { //添加更多的修改之处
            var ul = document.getElementById("ul");
            var li = document.createElement("li");
            var li2 = document.createElement("li");
            li.innerHTML = '原文: <input class="before" type="text" name="before[]" value="" placeholder="要替换的内容">';
            ul.appendChild(li);
            li2.innerHTML = '替换: <input class="after" type="text" name="after[]" value="" placeholder="替换后的内容">';
            ul.appendChild(li2);
        }
        var xmlHttp;
        function S_xmlhttprequest(){
        if(window.ActiveXobject){
            xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
        }else if(window.XMLHttpRequest){
            xmlHttp = new XMLHttpRequest();
        }
        }
        function tip(){
        var fn = $("input[name='fn']").val();
        // var fn = 2;
        // alert(f);//获取文本框内容
        if(fn!=""){
        S_xmlhttprequest();
        xmlHttp.open("POST","set.php",true);//找开请求
        xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
        xmlHttp.onreadystatechange = byphp;//准备就绪执行
        xmlHttp.send("fn="+fn);//发送
        }
        else{
            alert("请填写文件名");
        }
    }
    function byphp(){
        //判断状态
        // if(xmlHttp.readyState==1){//Ajax状态
        //     document.getElementById('tip').innerHTML = "正在加载";
        // }
        if(xmlHttp.readyState==4){//Ajax状态
            if(xmlHttp.status==200){//服务器端状态
            var tips = xmlHttp.responseText;
            if(tips==2){
                console.log(typeof(tips));
                console.log(tips);
                alert("文件不存在");
                
            }  
            if(tips == 3){
            var set = "txt,html,htm,doc,docx,php,js,css";
            alert("文件格式应为"+set+"之一");
            }  
            else{
                console.log(tips); 
            }
        }
        }
        }
    </script>
```
添加后的状态:
![添加](利用php做一个批量替换的小程序/添加后.png)


# 后台代码
后台使用php实现

因前端用ajax先传输数据进行无刷新的验证文件是否合法,所以要先对文件名进行判断
## 判断文件是否合法

先通过`file_exist()`函数来判断文件名是否存在。
```php
$dir = $_POST['fn'];

if(file_exists($dir)){//判断文件是否存在
    
}
else{
    echo "文件不存在";
}
```

如果文件存在,再判断文件名是否合法。这里用一个自己写的函数来验证(参数`$filename`是一个由`,`连接起来的数组)

```php
function set($filename){
  $filename = trim($filename,",");
  $filename = explode(",",$filename);
  $path = array();
   for($s=0;$s<count($filename);$s++){
       $postfix = trim(strrchr($filename[$s],'.'),'.');
       $set = "txt,html,htm,doc,docx,php,js,css";

       if(stristr($set,$postfix)){
           $path[] = $filename[$s];   
        
       }
    
   }
   if(empty($path)){
    return 0;
   } 
   

   return $path;
}

```
以上就是验证文件名的方法

## 遍历文件

如果输入的是文件夹,则需要遍历出文件夹中的文件名,利用递归的方式来遍历文件名.
```php
function read_all ($dir){
    $filename = "";
    if(!is_dir($dir)) {//判断是否为文件夹
        $filename = $dir.",";
        
    }
    else{
    $handle = opendir($dir);//打开目录并返回句柄资源
    if($handle){
        
        while(($fl = readdir($handle)) !== false){//readdir会依次读取$handle资源里的每一条记录,直到读到错误或者end-of-file
            $temp = iconv('GBK','utf-8',$dir.DIRECTORY_SEPARATOR.$fl);//转换成f-8格式

            //如果不加  $fl!='.' && $fl != '..'  则会造成把$dir的父级目录也读取出来
            if(is_dir($temp) && $fl!='.' && $fl != '..'){
                
                return read_all ($temp);
                
            }else{
                if($fl!='.' && $fl != '..'){
                   $filename .= $temp.",";
                   
                }
            }
        }
    }
   }
   return $filename;
}

```
## 完成替换

最后完成内容的替换

```php
$before = $_POST["before"];
$after = $_POST["after"];

for($i=0;$i<count($path);$i++){
        $fp = fopen($path[$i],"r");
        $str = fread($fp,filesize($path[$i]));
        echo "修改".$path[$i]."文件:<br>";
        $w = implode("", $before);
        if(!empty($w)){
            for($s=0;$s<count($before);$s++){
              if(!empty($before[$s])){ 
                $str = str_replace($before[$s],$after[$s],$str);
                echo "&nbsp;&nbsp;&nbsp;&nbsp;".$before[$s]."---->".$after[$s]."<br><br>";
            
            }
           
            }
            file_put_contents($path[$i],$str);
        }

fclose($fp);
header("Refresh:10;url=index.html");//返回前端页面
```
以上就是这个小程序的所有逻辑和相关代码,后台完整代码详见附录

# 附录

```php
<?php
header("content-type:text/html; charset= utf-8");
$dir = $_POST['fn'];
$before = $_POST["before"];
$after = $_POST["after"];

if(file_exists($dir)){
    $filename = read_all ($dir);
   // var_dump($filename);
    $path = set ($filename);
    // echo $path[0];
    if($path){
    for($i=0;$i<count($path);$i++){
        $fp = fopen($path[$i],"r");
        $str = fread($fp,filesize($path[$i]));
        echo "修改".$path[$i]."文件:<br>";
        $w = implode("", $before);
        if(!empty($w)){
            for($s=0;$s<count($before);$s++){
              if(!empty($before[$s])){ 
                $str = str_replace($before[$s],$after[$s],$str);
                echo "&nbsp;&nbsp;&nbsp;&nbsp;".$before[$s]."---->".$after[$s]."<br><br>";
            
            }
           
            }
            file_put_contents($path[$i],$str);
        }
        else{
            echo "daole";
                $str = str_replace("line-small","row-small",$str);
                $str = str_replace("line-middle","row-middle",$str);
                $str = str_replace("line-big","row-big",$str);
            for($p=1;$p<13;$p++){
                $str = str_replace(".x".$p,".col-xs-".$p,$str);
                $str = str_replace(".xl".$p,".col-xs-".$p,$str);
                $str = str_replace(".xs".$p,".col-sm-".$p,$str);
                $str = str_replace(".xm".$p,".col-md-".$p,$str);
                $str = str_replace(".xb".$p,".col-lg-".$p,$str);
            }
            file_put_contents($path[$i],$str);
        }

        fclose($fp);
        header("Refresh:10;url=index.html");
    }
    }
    else{
        $set = "txt,html,htm,doc,docx,php,js,css";
        echo "文件格式不符"."<br>"."文件格式应为".$set."中之一";
        header("Refresh:4;url=index.html");
        
    }



}
else{
    echo "文件不存在,请检查文件路径后再运行!";
    header("Refresh:4;url=index.html");
}
function read_all ($dir){
    $filename = "";
    if(!is_dir($dir)) {
        $filename = $dir.",";
        
    }
    else{
    $handle = opendir($dir);
    if($handle){
        
        while(($fl = readdir($handle)) !== false){
            $temp = iconv('GBK','utf-8',$dir.DIRECTORY_SEPARATOR.$fl);//转换成f-8格式
            //如果不加  $fl!='.' && $fl != '..'  则会造成把$dir的父级目录也读取出来
            
            if(is_dir($temp) && $fl!='.' && $fl != '..'){
                
                return read_all ($temp);
                
            }else{
                if($fl!='.' && $fl != '..'){
                   $filename .= $temp.",";
                   
                }
            }
        }
    }
   }
   return $filename;
}
function set($filename){
  $filename = trim($filename,",");
  $filename = explode(",",$filename);
  $path = array();
   for($s=0;$s<count($filename);$s++){
       $postfix = trim(strrchr($filename[$s],'.'),'.');
       $set = "txt,html,htm,doc,docx,php,js,css";

       if(stristr($set,$postfix)){
           $path[] = $filename[$s];   
        
       }
    
   }
   if(empty($path)){
    return 0;
   } 
   

   return $path;
}
 

?>

```








