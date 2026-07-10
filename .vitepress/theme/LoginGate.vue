<template>
  <div class="login-gate">
    <div class="lg-card">
      <div class="lg-badge">🔓 AI 工具免费用</div>

      <h1 class="lg-title">解锁银枢局<br />全部免费 AI 工具</h1>
      <p class="lg-sub">
        关注公众号后，短剧剧本生成、文章转 Word 等全部免费。<br />
        没有付费，没有套路。
      </p>

      <button class="lg-btn" @click="confirmLogin">
        ✅ 我已关注，免费使用 →
      </button>

      <p class="lg-warm">
        点击上方按钮 = 你已关注，直接解锁 😊
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
  padding: 56px 16px 100px;
  min-height: 80vh;
}
.lg-card {
  width: 100%;
  max-width: 440px;
  background: var(--vp-c-bg-soft, rgba(255, 255, 255, 0.04));
  border: 1px solid var(--vp-c-divider, rgba(240, 192, 64, 0.18));
  border-radius: 20px;
  padding: 44px 36px 40px;
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
  font-size: 28px;
  font-weight: 800;
  line-height: 1.35;
  margin: 0 0 16px;
  color: var(--vp-c-text-1);
}
.lg-sub {
  font-size: 14.5px;
  line-height: 1.75;
  color: var(--vp-c-text-2);
  margin: 0 0 36px;
}
.lg-btn {
  display: inline-block;
  width: 100%;
  padding: 16px 24px;
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
  box-shadow: 0 10px 36px rgba(240, 192, 64, 0.4);
}
.lg-warm {
  margin: 18px 0 0;
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--vp-c-text-3, rgba(240, 236, 226, 0.45));
}

/* 亮色模式 */
:root:not(.dark) .lg-card {
  background: #fff;
  border-color: rgba(240, 192, 64, 0.35);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.09);
}
:root:not(.dark) .lg-title {
  color: #111;
}
:root:not(.dark) .lg-sub {
  color: #555;
}
</style>
