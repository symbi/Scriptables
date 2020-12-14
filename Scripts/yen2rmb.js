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
//let API_WEATHER = "484119fa5c01cc21675583dbd8952384";//Load Your api here from https://openweathermap.org/ 
//let CITY_WEATHER = "1863967";//add your city ID "xushuguan"
//let wetherurl = "http://api.openweathermap.org/data/2.5/weather?id=" + CITY_WEATHER + "&APPID=" + API_WEATHER + "&units=metric";
//const weatherJSON = await fetchWeatherData(wetherurl);
//console.log(weatherJSON);
//get Json weather
/*
async function fetchWeatherData(url) {
  const request = new Request(url);
  const res = await request.loadJSON();
  return res;
}*/
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
  }

  /**
   * 渲染函数，函数名固定
   * 可以根据 this.widgetFamily 来判断小组件尺寸，以返回不同大小的内容
   */
  async render () {
    const data = await this.getData('bg')
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
    let data_info = await this.getData('info');
    console.log(data_info);
    w.backgroundImage = await this.getImage(data_bg['imgurl'])
    //console.log('data_info:',data_info['timestamp']);
    //w.url = data['img_url']
    let jpy=data_info['quotes']['USDJPY']
    let cny=data_info['quotes']['USDCNY']
    console.log(cny/jpy)
    w.url = this.url
    this.addCell(w, 'U->C: '+(cny.toFixed(2)).toString())
    this.addCell(w, 'J->C: '+((cny/jpy*100).toFixed(2)).toString())
    this.addCell(w, 'U->J: '+(jpy.toFixed(0)).toString())
    return w
  }
  async addCell(w,txt){
    const cell = w.addStack()
    cell.centerAlignContent()
    const cell_text = cell.addText(txt)
    cell_text.font = Font.heavyMonospacedSystemFont(20)
    //cell.addSpacer()
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
  async getData (flag) {
    
    let api=''
    switch(flag){
      case 'bg':
        api = `https://api.ixiaowai.cn/gqapi/gqapi.php?return=json`;
        break;
      case 'info':
        console.log('get data info');

        //API_KEY
        let API_WEATHER = "484119fa5c01cc21675583dbd8952384";//Load Your api here from https://openweathermap.org/ 
        let CITY_WEATHER = "1863967";//add your city ID "xushuguan"
        //let wetherurl = "http://api.openweathermap.org/data/2.5/weather?id=" + CITY_WEATHER + "&APPID=" + API_WEATHER + "&units=metric";
        let wetherurl = "http://api.openweathermap.org/data/2.5/weather";
        //api=wetherurl;
        api = "http://api.currencylayer.com/live";
        api = "http://api.currencylayer.com/live?access_key=d5d0cd2befe16bc06c612e14e0ef2f8e&currencies=JPY,CNY";
        break;
    }
    
    return await this.fetchAPI(api);
    //return await this.fetchWeatherData(api);
    
  }
  async fetchWeatherData(url) {
    const request = new Request(url);
    const res = await request.loadJSON();
    console.log(res);
    return res;
  }
  // http.get
  async fetchAPI (api, json = true) {
    let data = null
    try {
      let req = new Request(api)
      req.headers = {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/85.0.4183.102'
      }
      data = await (json ? req.loadJSON() : req.loadString())
    } catch (e) {
      console.log(e);
      console.log(api);
    }
    // 判断数据是否为空（加载失败）
    if (!data) {
      return null
    }
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
