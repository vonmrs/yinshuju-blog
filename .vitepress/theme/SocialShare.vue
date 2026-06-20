<template>
  <div class="social-share">
    <div class="share-title">分享文章</div>
    <div class="share-buttons">
      <button class="share-btn wechat" @click="shareWechat" title="分享到微信">
        <span class="icon">微信</span>
      </button>
      <button class="share-btn weibo" @click="shareWeibo" title="分享到微博">
        <span class="icon">微博</span>
      </button>
      <button class="share-btn twitter" @click="shareTwitter" title="分享到 Twitter">
        <span class="icon">Twitter</span>
      </button>
      <button class="share-btn copy" @click="copyLink" title="复制链接">
        <span class="icon">链接</span>
      </button>
    </div>
    <div v-if="showWechatQR" class="wechat-qr">
      <div class="qr-title">扫码分享到微信</div>
      <div class="qr-code" ref="qrCode"></div>
      <button class="close-btn" @click="showWechatQR = false">关闭</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showWechatQR = ref(false)
const qrCode = ref<HTMLElement | null>(null)

function getShareUrl() {
  if (typeof window !== 'undefined') {
    return window.location.href
  }
  return ''
}

function getShareTitle() {
  if (typeof window !== 'undefined') {
    const title = document.querySelector('title')
    return title ? title.textContent || '' : ''
  }
  return ''
}

function shareWechat() {
  showWechatQR.value = true
  // 使用 QRCode.js 生成二维码
  if (typeof window !== 'undefined' && qrCode.value) {
    // 动态加载 QRCode 库
    if (!(window as any).QRCode) {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js'
      script.onload = () => {
        generateQRCode()
      }
      document.head.appendChild(script)
    } else {
      generateQRCode()
    }
  }
}

function generateQRCode() {
  if (qrCode.value && (window as any).QRCode) {
    qrCode.value.innerHTML = ''
    new (window as any).QRCode(qrCode.value, {
      text: getShareUrl(),
      width: 128,
      height: 128
    })
  }
}

function shareWeibo() {
  const url = encodeURIComponent(getShareUrl())
  const title = encodeURIComponent(getShareTitle())
  window.open(`https://service.weibo.com/share/share.php?url=${url}&title=${title}`, '_blank')
}

function shareTwitter() {
  const url = encodeURIComponent(getShareUrl())
  const title = encodeURIComponent(getShareTitle())
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank')
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(getShareUrl())
    alert('链接已复制到剪贴板')
  } catch (err) {
    // 降级方案
    const input = document.createElement('input')
    input.value = getShareUrl()
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    alert('链接已复制')
  }
}
</script>

<style scoped>
.social-share {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.share-title {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
  font-weight: 500;
}

.share-buttons {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.share-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
}

.share-btn:hover {
  border-color: var(--inzu-gold);
  color: var(--inzu-gold);
}

.share-btn.wechat:hover {
  background: #07c160;
  color: white;
  border-color: #07c160;
}

.share-btn.weibo:hover {
  background: #ff6633;
  color: white;
  border-color: #ff6633;
}

.share-btn.twitter:hover {
  background: #1da1f2;
  color: white;
  border-color: #1da1f2;
}

.icon {
  font-size: 0.85rem;
}

.wechat-qr {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-align: center;
}

.qr-title {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.8rem;
}

.qr-code {
  display: flex;
  justify-content: center;
  margin-bottom: 0.8rem;
}

.close-btn {
  padding: 0.3rem 0.8rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: 0.8rem;
}

.close-btn:hover {
  background: var(--vp-c-bg-mute);
}
</style>
