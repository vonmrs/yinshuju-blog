<template>
  <div class="zj-gate">
    <div class="zj-card">
      <div class="zj-badge">🔭 朝鉴 · 趋势洞察</div>
      <h1 class="zj-title">朝鉴在微信公众号「银枢局」每日更新</h1>
      <p class="zj-desc">
        新闻背后的经济信号与机会窗口。<br />
        每天一条，看懂趋势。
      </p>

      <div class="zj-qr-wrap">
        <div class="zj-qr" ref="qrEl"></div>
      </div>

      <p class="zj-tip">
        📱 微信「扫一扫」识别上方二维码，<br />
        或在微信中搜索「<b>银枢局</b>」关注后查看往期合集
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { WECHAT_PROFILE_URL } from './wechat'

// 该链接仅在微信客户端内可打开；浏览器中通过二维码(微信扫码)跳转。
const WECHAT_TARGET = WECHAT_PROFILE_URL

const qrEl = ref<HTMLElement | null>(null)
const inWechat = ref(false)

function renderQr() {
  if (!qrEl.value) return
  const make = () => {
    const QR = (window as any).QRCode
    if (!QR || !qrEl.value) return
    new QR(qrEl.value, {
      text: WECHAT_TARGET,
      width: 220,
      height: 220,
      colorDark: '#1a1a1a',
      colorLight: '#ffffff',
      correctLevel: QR.CorrectLevel.H,
    })
  }
  if ((window as any).QRCode) {
    make()
  } else {
    const s = document.createElement('script')
    s.src = 'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js'
    s.onload = make
    document.head.appendChild(s)
  }
}

onMounted(() => {
  const ua = navigator.userAgent.toLowerCase()
  // 在微信内：直接跳转公众号主页（链接在微信内有效）
  if (ua.includes('micromessenger')) {
    inWechat.value = true
    window.location.replace(WECHAT_TARGET)
    return
  }
  // 浏览器内：展示二维码，引导用户微信扫码
  renderQr()
})
</script>

<style scoped>
.zj-gate {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  background: var(--vp-c-bg);
}
.zj-card {
  max-width: 460px;
  width: 100%;
  text-align: center;
  padding: 3rem 2.5rem;
  border-radius: 18px;
  border: 1px solid var(--vp-c-divider);
  background: var(--c-zj-bg, rgba(240, 236, 226, 0.5));
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}
.zj-badge {
  display: inline-block;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  color: var(--inzu-gold);
  border: 1px solid var(--inzu-gold);
  border-radius: 100px;
  padding: 0.3rem 1rem;
  margin-bottom: 1.2rem;
}
.zj-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--vp-c-text-1);
  margin: 0 0 0.8rem;
  line-height: 1.4;
}
.zj-desc {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 2rem;
}
.zj-qr-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}
.zj-qr {
  width: 220px;
  height: 220px;
  padding: 12px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}
.zj-qr :deep(img),
.zj-qr :deep(canvas) {
  display: block;
}
.zj-tip {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  line-height: 1.8;
}
.zj-tip b {
  color: var(--inzu-gold);
}
</style>
