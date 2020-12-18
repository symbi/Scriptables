// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: comments;
//
// iOS 桌面组件脚本 @「小件件」
// 开发说明：请从 Widget 类开始编写，注释请勿修改
// https://x.im3x.cn
//

// 添加require，是为了vscode中可以正确引入包，以获得自动补全等功能
if (typeof require === 'undefined') require = importModule
const { Base } = require("./「小件件」开发环境")

// @组件代码开始
class Widget extends Base {
  //url = 'https://mp.weixin.qq.com/s/wNVTp1KMZNa-F3MbCHO_TA'
  url ='https://www.xe.com/currencycharts/?from=JPY&to=CNY&view=1Y'

  /**
   * 传递给组件的参数，可以是桌面 Parameter 数据，也可以是外部如 URLScheme 等传递的数据
   * @param {string} arg 自定义参数
   */
  constructor (arg) {
    super(arg)
    this.name = '蚂蚁庄园'
    this.desc = '今天的题会做么？'
    this.api_key = '51a0cc02ea7643023fb0c37d0dba2881';
    this.url_uj = 'https://www.xe.com/currencycharts/?from=USD&to=JPY&view=1Y'
    this.url_jc = 'https://www.xe.com/currencycharts/?from=JPY&to=CNY&view=1Y'
    this.url_uc = 'https://www.xe.com/currencycharts/?from=USD&to=CNY&view=1Y'
    let today = new Date()
    let yesterday = new Date(Date.now() - 864e5)
    console.log(today.toLocaleDateString("en-US"))
    console.log(yesterday.toLocaleDateString("en-US"))
    // 当前设置的存储key（提示：可通过桌面设置不同参数，来保存多个设置）
    //let _md5 = this.md5(module.filename)
    let _md5 = this.md5(today.toLocaleDateString("en-US"))
    let _md5_last = this.md5(yesterday.toLocaleDateString("en-US"))
    this.CACHE_KEY = `cache_${_md5}`
    this.CACHE_KEY_LAST = `cache_${_md5_last}`

  }

  /**
   * 渲染函数，函数名固定
   * 可以根据 this.widgetFamily 来判断小组件尺寸，以返回不同大小的内容
   */
  async render () {
    const data = await this.getData('bg',false)
    switch (this.widgetFamily) {
      case 'large':
        return await this.renderLarge(data)
      case 'medium':
        return await this.renderMedium(data)
      default:
        return await this.renderSmall(data)
    }
  }
  /**
   * 加载远程图片
   * @param url string 图片地址
   * @return image
   */
  async getImage (url) {
    let req = new Request(url)
    return await req.loadImage()
  }

  /**
   * 给图片加上半透明遮罩
   * @param img 要处理的图片对象
   * @return image
   */
  async shadowImage (img) {
    let ctx = new DrawContext()
    ctx.size = img.size
    ctx.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']))
    // 图片遮罩颜色、透明度设置
    ctx.setFillColor(new Color("#000000", 0.7))
    ctx.fillRect(new Rect(0, 0, img.size['width'], img.size['height']))
    let res = await ctx.getImage()
    return res
  }


    /**
   * 渲染小尺寸组件
   */
  async renderSmall (data_bg) {
    let w = new ListWidget()
    //let data_bg = await this.getData('bg')
    let data_info = await this.getData('info',this.CACHE_KEY);
    let data_info_yetd = await this.getData('info',this.CACHE_KEY_LAST);
    //console.log(data_info);
    console.log(data_info_yetd);
    w.backgroundImage = await this.getImage(data_bg['imgurl'])
    //console.log('data_info:',data_info['timestamp']);
    //w.url = data['img_url']
    let jpy_td=data_info['quotes']['USDJPY']
    let jpy_yd=data_info_yetd['quotes']['USDJPY']
    let cny_td=data_info['quotes']['USDCNY']
    let cny_yd=data_info_yetd['quotes']['USDCNY']
    //console.log(cny/jpy)
    //w.url = this.url
    
    let color_uc=Color.white()
    let color_jc=Color.white()
    let color_uj=Color.white()
    let u_c_td=cny_td.toFixed(2)
    let u_c_yd=cny_yd.toFixed(2)
    let j_c_td=(cny_td/jpy_td*100).toFixed(2)
    let j_c_yd=(cny_yd/jpy_yd*100).toFixed(2)
    let u_j_td=jpy_td.toFixed(0)
    let u_j_yd=jpy_yd.toFixed(0)
    color_uc=this.getColor(u_c_td,u_c_yd)
    color_jc=this.getColor(j_c_td,j_c_yd)
    color_uj=this.getColor(u_j_td,u_j_yd)

    
    this.addCell(w, 'U->C: '+u_c_td.toString(), color_uc, this.url_uc)
    this.addCell(w, 'J->C: '+j_c_td.toString(), color_jc, this.url_jc)
    this.addCell(w, 'U->J: '+u_j_td.toString(), color_uj, this.url_uj)
    return w
  }
  getColor(t,y){
    if (t<y)return Color.green()
    if (t>y)return Color.red()
    return Color.white()
  }
  async addCell(w,txt,color,url){
    const cell = w.addStack()
    cell.centerAlignContent()
    const cell_text = cell.addText(txt)
    cell_text.font = Font.heavyMonospacedSystemFont(20)
    cell_text.textColor = color
    //cell.addSpacer()
    //cell.url= this.actionOpenUrl(url)
    cell.url= url //this.actionUrl('open-url', url)
    w.addSpacer(10)
    return w
  }
  /**
   * 渲染中尺寸组件
   */
  async renderMedium (data, num = 4, title = false) {
    let w = new ListWidget()
    // await this.renderHeader(w, data['logo'], data['title'])
    data.slice(0, num * 2).map((d, idx) => {
      if (!title && idx % 2 === 0) return;
      const cell = w.addStack()
      cell.centerAlignContent()
      const cell_text = cell.addText(d)
      cell_text.font = Font.lightSystemFont(16)
      cell.addSpacer()
      w.addSpacer(10)
    })
    w.url = this.actionUrl(this.url)
    w.addSpacer()
    return w
  }
  /**
   * 渲染大尺寸组件
   */
  async renderLarge (data) {
    return await this.renderMedium(data, 5, true)
  }

  /**
   * 获取数据函数，函数名可不固定
   */
  async getData (flag,cache) {
    
    let api=''
    switch(flag){
      case 'bg':
        console.log('get data bg');
        api = `https://api.ixiaowai.cn/gqapi/gqapi.php?return=json`;
        break;
      case 'info':
        console.log('get data info');
        //api = "http://api.currencylayer.com/live";
        api = 'http://api.currencylayer.com/live?access_key='+this.api_key+'&currencies=JPY,CNY';
        break;
    }
    return await this.httpGet_api(api,true,cache);
  }

  async httpGet_api (url, json = true, cacheKey) {
    let data = null
    //const cacheKey = this.CACHE_KEY
    if (cacheKey && Keychain.contains(cacheKey)) {
      console.log('exist cache in httpGet:',url)
      let cache = Keychain.get(cacheKey)
      //console.log(cache)
      //Keychain.remove(cacheKey)
      //if(!cache)console.log('cache none')
      if(!cache)return null
      return json ? JSON.parse(cache) : cache
    }
    try {
      console.log('httpGet first time:',url)
      let req = new Request(url)
      data = await (json ? req.loadJSON() : req.loadString())
      
    } catch (e) {}
    // 判断数据是否为空（加载失败）
    
    
    //if (!data && Keychain.contains(cacheKey)) {
    /*if (!data) {
      console.log('empty data')
      return null
      // 判断是否有缓存
      //let cache = Keychain.get(cacheKey)
      //return json ? JSON.parse(cache) : cache
    }*/
    // 存储缓存
    if(cacheKey)Keychain.set(cacheKey, json ? JSON.stringify(data) : data)
    
    return data
  }

  /**
   * 自定义注册点击事件，用 actionUrl 生成一个触发链接，点击后会执行下方对应的 action
   * @param {string} url 打开的链接
   */
  async actionOpenUrl (url) {
    Safari.openInApp(url, false)
  }

}
// @组件代码结束

const { Testing } = require("./「小件件」开发环境")
await Testing(Widget)
