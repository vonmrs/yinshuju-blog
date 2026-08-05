// 微信公众号配置（朝鉴落地页二维码 / 微信内跳转）
// ⚠️ 换公众号或修正时，只改 WECHAT_BIZ_ID 这一行
// 取值位置：微信公众平台后台任意文章页 → F12 → Network →
//          找 profile_ext 请求 → URL 里 __biz= 后的 Base64 串
export const WECHAT_BIZ_ID = 'MzUzMjQ2NjQ0Mw=='

// 公众号主页链接（仅微信客户端内可打开；浏览器中通过扫码访问）
export const WECHAT_PROFILE_URL =
  `https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=${WECHAT_BIZ_ID}&scene=126#wechat_redirect`
