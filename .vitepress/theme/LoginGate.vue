<template>
  <div class="login-gate">
    <div class="lg-card">
      <div class="lg-badge">🔓 关注即免费解锁</div>

      <h1 class="lg-title">关注「银枢局」公众号<br />免费使用 AI 系列工具</h1>
      <p class="lg-sub">
        短剧剧本一键生成 · 文章秒转 Word · 更多 AI 利器，<br />
        关注公众号后全部免费畅用。
      </p>

      <div class="lg-qr-wrap">
        <div class="lg-qr-frame">
          <img class="lg-qr" src="/wechat-qrcode.jpg" alt="银枢局公众号二维码" />
        </div>
        <p class="lg-qr-tip">长按 / 微信扫一扫，关注「银枢局」</p>
      </div>

      <ol class="lg-steps">
        <li>长按上方二维码，关注公众号 <b>银枢局</b></li>
        <li>点击下方按钮，立即免费解锁全部 AI 工具</li>
      </ol>

      <button class="lg-btn" @click="confirmLogin">我已关注，免费使用 →</button>

      <p class="lg-warm">
        还没关注？先长按二维码关注「银枢局」，再点按钮即可 😊<br />
        关注后所有 AI 工具免费开放，无需任何付费。
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'
import { isAuthed, setAuthed, getRedirectTarget } from './useAuth'

const router = useRouter()

function go(target: string) {
  if (target.startsWith('http')) window.location.href = target
  else router.go(target)
}

onMounted(() => {
  // 已登录则直接跳回目标页（或首页）
  if (isAuthed()) go(getRedirectTarget('/'))
})

function confirmLogin() {
  setAuthed()
  go(getRedirectTarget('/'))
}
</script>

<style scoped>
.login-gate {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 48px 16px 80px;
  min-height: 70vh;
}
.lg-card {
  width: 100%;
  max-width: 460px;
  background: var(--vp-c-bg-soft, rgba(255, 255, 255, 0.04));
  border: 1px solid var(--vp-c-divider, rgba(240, 192, 64, 0.18));
  border-radius: 20px;
  padding: 40px 32px 36px;
  text-align: center;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.28);
}
.lg-badge {
  display: inline-block;
  font-size: 12px;
  letter-spacing: 1px;
  color: var(--inzu-gold, #f0c040);
  border: 1px solid rgba(240, 192, 64, 0.35);
  border-radius: 100px;
  padding: 5px 16px;
  margin-bottom: 22px;
}
.lg-title {
  font-size: 26px;
  font-weight: 800;
  line-height: 1.35;
  margin: 0 0 14px;
  color: var(--vp-c-text-1);
}
.lg-sub {
  font-size: 14px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  margin: 0 0 28px;
}
.lg-qr-wrap {
  margin-bottom: 26px;
}
.lg-qr-frame {
  display: inline-block;
  padding: 12px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}
.lg-qr {
  display: block;
  width: 200px;
  height: 200px;
  object-fit: contain;
  border-radius: 8px;
}
.lg-qr-tip {
  margin: 14px 0 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.lg-steps {
  text-align: left;
  max-width: 320px;
  margin: 0 auto 26px;
  padding-left: 22px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.9;
}
.lg-steps b {
  color: var(--inzu-gold, #f0c040);
}
.lg-btn {
  display: inline-block;
  width: 100%;
  padding: 15px 24px;
  border: none;
  border-radius: 100px;
  background: linear-gradient(135deg, var(--inzu-gold, #f0c040), var(--inzu-gold-dim, #c9a020));
  color: #0a0a0f;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: transform 0.25s, box-shadow 0.25s;
}
.lg-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(240, 192, 64, 0.35);
}
.lg-warm {
  margin: 18px 0 0;
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--vp-c-text-3, rgba(240, 236, 226, 0.5));
}

/* 亮色模式下边框/文字适配 */
:root:not(.dark) .lg-card {
  background: #fff;
  border-color: rgba(240, 192, 64, 0.4);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}
:root:not(.dark) .lg-title {
  color: #1a1a1a;
}
:root:not(.dark) .lg-sub,
:root:not(.dark) .lg-qr-tip {
  color: #555;
}
</style>
