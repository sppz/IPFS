# WorkerJS_CloudFlare_ImageBed

基于CloudFlare Worker的JS，多个图床示例

仅供学习CloudFlare Worker开发使用，违规使用后果自负

## 里程碑

- 20230918 首发 58imgjs https://gist.github.com/BlueSkyXN/0be89e736cd2fe0418f77c034538c502/revisions
- 20230919 首发 3001imgjs https://gist.github.com/BlueSkyXN/cf009388660348915be2166f6080e02d/revisions
- 20230924 首发 tgphimgjs https://gist.github.com/BlueSkyXN/8d261d13d79e7a7672999f9935acdfe9/revisions
- 20231006 首发 tgph批量上传 https://gist.github.com/BlueSkyXN/969c20bf0378ef39cb09793bfab1ca80/revisions
- 20231020 首发 163imgjs https://gist.github.com/BlueSkyXN/b0c06952bd402545abedcb0ee73d05d9/revisions
- 20231123 证实3001图床要求登录 ``{"data":[],"code":401,"msg":"请先登录"}`` 然后首发 58imgpy
- 20231124 通过163imgpy验证了接口失效``no healthy upstream``，新增 weixinyanxuan.com 的玩具py，js实现失败
- 20240219 如果需要进一步加速图片的，还可以参考 《公开免费无限的图片加速代理接口》 [https://www.blueskyxn.com/202402/7006.html](https://www.blueskyxn.com/202402/7006.html)
- 20240220 如果使用CloudFlareR2对象存储的，还可以参考 [https://github.com/BlueSkyXN/CF-R2-WorkerJS](https://github.com/BlueSkyXN/CF-R2-WorkerJS) 来进行优化 
- 20240327 花了2天时间，完成统一接口前后端设计,教程 https://github.com/BlueSkyXN/WorkerJS_CloudFlare_ImageBed/blob/main/docs/Serverless.md
- 20240328 根据图片加速接口，写了一个纯前端转换器
- 20240906 TG创始人被抓后开始降本增效，停用了TGPH上传
- 20240907 新增10086和TX2个渠道
