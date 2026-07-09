// 银枢局 · 登录态（关注公众号即登录）工具
// 当前为「信任式」MVP：用户点击「我已关注」即视为已登录。
// 升级路径：微信认证服务号 + 网页授权，调用微信接口校验 unionid 关注状态
// （需 Vercel Serverless Function 中转，详见 LoginGate 组件说明）。

const AUTH_KEY = 'yzj_follow_auth'

export function isAuthed(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(AUTH_KEY) === '1'
  } catch {
    return false
  }
}

export function setAuthed(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(AUTH_KEY, '1')
  } catch {
    /* ignore */
  }
}

export function clearAuth(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(AUTH_KEY)
  } catch {
    /* ignore */
  }
}

/** 解析登录页 ?redirect= 参数，返回要跳回的路径 */
export function getRedirectTarget(fallback = '/'): string {
  if (typeof window === 'undefined') return fallback
  try {
    const p = new URLSearchParams(window.location.search).get('redirect')
    return p && p.startsWith('/') ? p : fallback
  } catch {
    return fallback
  }
}

/** 跳转到登录页，并带上 returnPath 作为回跳地址 */
export function redirectToLogin(returnPath = '/'): void {
  if (typeof window === 'undefined') return
  const q = returnPath && returnPath !== '/' ? '?redirect=' + encodeURIComponent(returnPath) : ''
  window.location.href = '/login/' + q
}
