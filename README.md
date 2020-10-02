# 说明

基于 [MDUI](https://www.mdui.org/) 的 [ngx-fancyindex](https://github.com/aperezdc/ngx-fancyindex) 模块主题

# 效果
![image.png](https://i.loli.net/2020/10/03/O3kl5x1sgD7woIC.png)

![image.png](https://i.loli.net/2020/10/03/TAhtB9z4Lu2aWKo.png)

# 安装

安装 [ngx-fancyindex](https://github.com/aperezdc/ngx-fancyindex) (by @aperezdc)

简单的nginx配置
```
location / {
    root    /mnt/workspace/resource/static;
    index   index.html welcome/index.html;
}

location /download {
    alias                   /mnt/workspace/resource/download/;
    # 开启目录浏览
    fancyindex              on;
    # 不使用精确大小
    fancyindex_exact_size   off;
    # 使用本地时间
    fancyindex_localtime    on;
    # 指定中文编码
    charset                 utf-8,gbk;

    fancyindex_name_length  100;
    # 时间格式
    fancyindex_time_format  "%Y-%m-%d %T";
    # theme
    fancyindex_header       /fancyindex/header.html;
    fancyindex_footer       /fancyindex/footer.html;
    fancyindex_ignore       ^fancyindex;
}
```

克隆项目到你的Nginx映射的根路径下
```shell script
git git@github.com:marioplus/nginx-fancyindex-theme.git
mv nginx-fancyindex-theme fancyindex
```

将`js/FileBrowserContext.js`的此处修改为你映射的下载目录，路径最后需要以`/`结尾

![image.png](https://i.loli.net/2020/10/03/s4aQFSqEdoDc3Yu.png)

