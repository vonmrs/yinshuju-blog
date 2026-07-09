<template>
  <div class="duanju-wrap">
    <!-- 背景微粒 -->
    <div v-if="mounted" class="dj-particles">
      <div v-for="i in 18" :key="i" class="dj-particle" :style="particleStyle(i)"></div>
    </div>

    <!-- Hero -->
    <section class="dj-hero">
      <div class="dj-badge">
        <span class="dot"></span>AI 剧本引擎已上线
      </div>
      <h1>每一部爆款短剧<br><span class="gold">一句好故事</span>开始</h1>
      <p class="dj-sub">
        输入题材与设定，AI 自动生成完整短剧剧本——人物小传、分集大纲、逐集正文，含悬念钩子，直达付费解锁点。
      </p>
      <div class="dj-actions">
        <button class="dj-btn dj-btn-primary" @click="freeStart">🚀 免费生成第一集</button>
        <button class="dj-btn dj-btn-ghost" @click="scrollTo('dj-pricing')">查看定价</button>
      </div>
    </section>

    <!-- 输入区 -->
    <section class="dj-input-section" id="dj-input">
      <div class="dj-section-label">Step 01 — 设定你的短剧</div>
      <div class="dj-glass-card">
        <div class="dj-form-grid">
          <div class="dj-field">
            <label>题材类型</label>
            <select v-model="topic">
              <option>霸总</option>
              <option>逆袭</option>
              <option>穿越</option>
              <option>复仇</option>
              <option>甜宠</option>
              <option>悬疑</option>
            </select>
          </div>
          <div class="dj-field">
            <label>总集数</label>
            <select v-model="episodes">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </select>
          </div>
          <div class="dj-field">
            <label>风格偏好</label>
            <select v-model="style">
              <option>爽文风格</option>
              <option>虐心风格</option>
              <option>搞笑风格</option>
              <option>烧脑悬疑</option>
            </select>
          </div>
          <div class="dj-field">
            <label>男主人设（选填）</label>
            <input v-model="hero" type="text" placeholder="例：冷酷总裁 / 腹黑王爷">
          </div>
          <div class="dj-field" style="grid-column:1/-1">
            <label>女主人设（选填）</label>
            <input v-model="heroine" type="text" placeholder="例：落魄千金 / 唐朝穿越者">
          </div>
        </div>
        <button class="dj-gen-btn" :disabled="generating" @click="generate">
          {{ generating ? '生成中，请稍候…' : '✨ 生成完整剧本' }}
        </button>
      </div>
    </section>

    <!-- 预览区 -->
    <section class="dj-preview-section" id="dj-preview">
      <div class="dj-preview-header">
        <div class="dj-preview-title">📖 剧本预览</div>
        <div class="dj-preview-badge" :style="{ color: badgeColor }">{{ badgeText }}</div>
      </div>
      <div class="dj-preview-body">
        <template v-if="!result">
          <div class="dj-empty-hint">
            ← 填写左侧参数，点击「生成完整剧本」<br>即可在这里实时预览 AI 生成的短剧剧本
          </div>
        </template>
        <template v-else>
          <div class="dj-chars-block">
            <div class="label">人物小传 &amp; 分集大纲</div>
            <pre>{{ result.chars }}</pre>
          </div>
          <div v-for="(ep, i) in result.episodes" :key="i" class="dj-episode-block">
            <div class="dj-episode-title">{{ ep.title }}</div>
            <div class="dj-scene">{{ ep.scene }}</div>
            <div class="dj-body">{{ ep.body }}</div>
            <div class="dj-hook">🎣 悬念：{{ ep.hook }}</div>
          </div>
          <div v-if="episodes > 3" class="dj-more-hint">
            …… 还有 {{ episodes - 3 }} 集，订阅专业版查看完整剧本 ……
          </div>
        </template>
        <div v-if="generating" class="dj-loading">
          <span class="dj-loading-dots"></span>AI 正在分析题材规律、生成人物小传
        </div>
      </div>
    </section>

    <!-- 定价 -->
    <section class="dj-pricing-section" id="dj-pricing">
      <div class="dj-section-label" style="text-align:center">定价方案</div>
      <h2 class="dj-pricing-title">选择你的创作计划</h2>
      <p class="dj-pricing-sub">从免费体验到专业量产，总有适合你的方案</p>
      <div class="dj-pricing-grid">
        <div class="dj-price-card">
          <div class="dj-price-name">体验版</div>
          <div class="dj-price-amount"><span class="yen">¥</span>0</div>
          <div class="dj-price-period">永久免费</div>
          <ul class="dj-price-features">
            <li>每月 3 部剧本</li>
            <li>基础题材（霸总/甜宠）</li>
            <li>标准输出格式</li>
            <li>社区支持</li>
          </ul>
          <button class="dj-price-btn dj-price-btn-ghost">免费开始</button>
        </div>
        <div class="dj-price-card featured">
          <div class="dj-price-name">专业版</div>
          <div class="dj-price-amount"><span class="yen">¥</span>199</div>
          <div class="dj-price-period">每月</div>
          <ul class="dj-price-features">
            <li>无限剧本生成</li>
            <li>全部 6 种题材</li>
            <li>自定义人设</li>
            <li>扣子 API 接入</li>
            <li>优先支持</li>
          </ul>
          <button class="dj-price-btn dj-price-btn-primary">立即订阅</button>
        </div>
        <div class="dj-price-card">
          <div class="dj-price-name">企业版</div>
          <div class="dj-price-amount"><span class="yen">¥</span>999</div>
          <div class="dj-price-period">每月</div>
          <ul class="dj-price-features">
            <li>专业版全部功能</li>
            <li>AI 视频脚本生成</li>
            <li>ComfyUI 分镜生成</li>
            <li>专属客户经理</li>
            <li>API 无限调用</li>
          </ul>
          <button class="dj-price-btn dj-price-btn-ghost">联系销售</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { isAuthed, redirectToLogin } from '../theme/useAuth'

const mounted = ref(false)
const topic = ref('霸总')
const episodes = ref('20')
const style = ref('爽文风格')
const hero = ref('')
const heroine = ref('')
const generating = ref(false)
const result = ref(null)

const DEMO_SCRIPTS = {
  '霸总': {
    chars: '【人物小传】\n男主：陆景琛，28岁，陆氏集团总裁，外表冷酷，内心有童年创伤，不轻易相信他人。\n女主：苏晚，24岁，落魄千金，倔强独立，为救家族企业潜入陆氏。\n\n【分集大纲】\n第1集：面试相遇，陆景琛对苏晚印象极差\n第2集：苏晚意外救了陆景琛，关系微妙变化\n第3集：两人被迫绑在一起出差，暧昧升温',
    episodes: [
      { title: '第1集：面试', scene: '📍 陆氏集团会议室，上午', body: '苏晚推开会议室的门，迎面撞上一道冰冷的目光。\n\n陆景琛坐在长桌尽头，西装笔挺，手指轻叩桌面："你迟到了三分钟。"\n\n"路上堵车，陆总。"苏晚不卑不亢。\n\n"我不管你路上发生了什么。"他起身，居高临下，"在陆氏，结果说话。你的简历，我不满意。"\n\n苏晚咬牙。她需要这份工作。', hook: '陆景琛的眼神里，闪过一丝不易察觉的……欣赏？' },
      { title: '第2集：意外', scene: '📍 公司地下车库，夜晚', body: '加班到十点，苏晚独自走向车库。\n\n突然——两个黑影从柱子后冲出！\n\n她还没来得及尖叫，一道高大的身影挡在她面前。陆景琛一脚踹在最前面的人膝盖上，顺势把苏晚拉到自己身后。\n\n"你……怎么会在这里？"苏晚愣住。\n\n他没有回答，拽着她快步走向自己的车。"上车。"', hook: '后视镜里，苏晚看见他手背在流血。' },
      { title: '第3集：出差', scene: '📍 酒店大堂，下午', body: '被迫一起出差谈项目，飞机上两人全程无话。\n\n直到酒店办理入住时——\n\n"只有一间房了？"苏晚瞪大眼睛。\n\n陆景琛面不改色："隔壁城市会展，房间紧张。忍一晚。"\n\n深夜，苏晚轻手轻脚去倒水，发现陆景琛坐在阳台上，手里拿着一张泛黄的照片，眼神温柔得不像他。', hook: '陆景琛发现苏晚站在门口，迅速收起照片："你看错了。"' }
    ]
  },
  '逆袭': {
    chars: '【人物小传】\n男主：陈北，26岁，出身底层，被富家子弟欺辱三年，隐忍积蓄力量，一朝翻身。\n女主：林清清，24岁，陈北青梅竹马，始终不离不弃。\n\n【分集大纲】\n第1集：会所羞辱，陈北隐忍不发\n第2集：神秘名片浮出水面\n第3集：三个月后，王者归来',
    episodes: [
      { title: '第1集：羞辱', scene: '📍 凯旋会所门口，晚上', body: '陈北穿着洗得发白的外套，被三个西装青年围在墙角。\n\n"就你这种穷鬼，也敢来这种地方？"为首的赵天磊把红酒泼在陈北胸口。\n\n围观的人笑了。\n\n陈北没说话，默默擦了擦衣服。\n\n林清清冲过来，挡在陈北面前："你们太过分了！"\n\n赵天磊冷笑："林大小姐，你找个这种男朋友，不怕丢脸？"', hook: '他兜里那张皱巴巴的名片，背面写着一个电话号码。' },
      { title: '第2集：转机', scene: '📍 城中村出租屋，凌晨', body: '林清清帮陈北处理伤口。\n\n"北哥，要不我们离开这里吧……"她眼眶红了。\n\n陈北握住她的手："清清，再给我三天。"\n\n他拿出那张名片——上面写着一个名字：周启明，创投圈教父。\n\n三年前，陈北救过一个晕倒的老人。那个老人，是周启明的父亲。', hook: '"小陈啊……你终于肯联系我了。"电话那头，周启明叹了口气。' },
      { title: '第3集：归来', scene: '📍 凯旋会所同一门口，三个月后', body: '奔驰大G停在门口，陈北一身定制西装下车。\n\n赵天磊正在门口抽烟，看见陈北，烟掉在了地上。\n\n"你……你怎么……"\n\n陈北平静地走过他，没有停留。\n\n大堂里，赵天磊的父亲正陪着周启明聊天。看见陈北进来，周启明起身："来，我给你介绍一下——这位，是北辰科技的创始人，陈北。"', hook: '赵天磊跪在地上，不是对陈北——是对他父亲。' }
    ]
  },
  '穿越': {
    chars: '【人物小传】\n男主：李承璟，28岁，大唐皇子，城府极深，精通权谋。\n女主：沈念，26岁，现代急诊科医生，穿越至唐朝，被迫入宫为医女。\n\n【分集大纲】\n第1集：医院夜班，意外穿越\n第2集：被迫入宫，巧遇皇子\n第3集：现代医术震惊太医院',
    episodes: [
      { title: '第1集：穿越', scene: '📍 急诊室，深夜', body: '连轴转了16个小时，沈念靠在急诊室的椅子上眯了一会儿。\n\n再睁开眼——\n\n古色古香的木梁，青铜灯盏，空气中弥漫着草药的气味。\n\n"医女？还不快起来！"一个嬷嬷踢了她一脚，"三皇子的伤口裂开了，皇后娘娘震怒，你担当得起吗？"\n\n沈念低头一看——自己穿着一身素色襦裙，手上拿着纱布。', hook: '门帘掀开，一个眼神冷峻的男人被扶了进来，正是三皇子李承璟。' },
      { title: '第2集：初诊', scene: '📍 三皇子寝殿，夜晚', body: '沈念强迫自己镇定下来，走向床榻。\n\n李承璟半躺在床上，左臂缠着渗血的纱布，脸色苍白。\n\n"退下。"他冷冷扫了她一眼。\n\n"殿下，您的伤口感染了。"沈念用现代医学知识分析，"如果不及时处理，恐怕会……"\n\n"你倒是有几分胆色。"李承璟眯起眼，"整个太医院都治不好本王的伤，你一个来历不明的医女，有什么本事？"', hook: '沈念脱口而出："无菌操作，清创缝合，再加抗生素。"李承璟眉头一动："何为……抗生素？"' },
      { title: '第3集：震惊', scene: '📍 太医院，次日', body: '沈念让人找来烈酒、高温消毒的针线，还有……烧开的热水。\n\n整个太医院的老大夫们围在门口，看她像看怪物一样。\n\n她用烈酒清洗伤口，手稳得像机器人。\n\n一炷香后，缝合完毕。\n\n"这……这……"老太医目瞪口呆，"如此缝合方式，从未见过！"\n\n李承璟低头看着手臂上整齐的针脚，第一次露出意外的神情。', hook: '他抬眼看向沈念："你，究竟是什么人？"' }
    ]
  }
}

const badgeText = computed(() => result.value ? `已生成 · ${episodes.value} 集` : '等待生成…')
const badgeColor = computed(() => result.value ? '#4ade80' : '#c9a020')

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

// 「免费生成第一集」入口：未关注公众号则先跳转登录
function freeStart() {
  if (!isAuthed()) {
    redirectToLogin('/tools/duanju/')
    return
  }
  scrollTo('dj-input')
}

function generate() {
  // 网关：未关注公众号(未登录)则跳转登录页
  if (!isAuthed()) {
    redirectToLogin('/tools/duanju/')
    return
  }
  generating.value = true
  setTimeout(() => {
    result.value = DEMO_SCRIPTS[topic.value] || DEMO_SCRIPTS['霸总']
    generating.value = false
  }, 2200)
}

function particleStyle(i) {
  const size = 1 + Math.random() * 2
  return {
    left: Math.random() * 100 + 'vw',
    animationDuration: (6 + Math.random() * 10) + 's',
    animationDelay: Math.random() * 8 + 's',
    width: size + 'px',
    height: size + 'px'
  }
}

onMounted(() => { mounted.value = true })
</script>

<style scoped>
/* ===== 全屏暗色容器 ===== */
.duanju-wrap {
  background: #0a0a0f;
  min-height: calc(100vh - 64px);
  margin: -1.5rem -1.5rem -1.5rem;
  padding: 0 0 2rem;
  overflow-x: hidden;
  font-family: 'Inter', 'Noto Sans SC', sans-serif;
  position: relative;
}

.duanju-wrap::before {
  content: '';
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 20% 10%, rgba(240,192,64,0.04), transparent),
    radial-gradient(ellipse 60% 80% at 80% 90%, rgba(240,192,64,0.03), transparent),
    repeating-linear-gradient(0deg, transparent, transparent 400px, rgba(255,255,255,0.008) 400px, rgba(255,255,255,0.008) 401px);
  pointer-events: none;
  z-index: 0;
}

/* 微粒 */
.dj-particle {
  position: fixed;
  border-radius: 50%;
  background: #f0c040;
  opacity: 0;
  animation: floatParticle linear infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes floatParticle {
  0%   { transform: translateY(0) scale(1); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(-100vh) scale(0); opacity: 0; }
}

/* ── Hero ── */
.dj-hero {
  position: relative;
  min-height: 72vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 2rem 60px;
  z-index: 1;
}

.dj-hero::after {
  content: '';
  position: absolute;
  top: -50%; left: -50%;
  width: 200%; height: 200%;
  background: conic-gradient(from 0deg, transparent 0%, rgba(240,192,64,0.03) 10%, transparent 20%);
  animation: djGlowSweep 8s linear infinite;
  pointer-events: none;
}

@keyframes djGlowSweep {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.dj-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 18px;
  border: 1px solid rgba(240,192,64,0.25);
  border-radius: 100px;
  font-size: 12px;
  color: #c9a020;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 28px;
  animation: djFadeUp 0.8s ease both;
}

.dot {
  width: 6px; height: 6px;
  background: #4ade80;
  border-radius: 50%;
  animation: djPulse 2s ease infinite;
}

@keyframes djPulse {
  0%,100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.4; transform: scale(1.5); }
}

.dj-hero h1 {
  font-family: 'Noto Serif SC', serif;
  font-size: clamp(2rem, 5vw, 4.5rem);
  font-weight: 900;
  line-height: 1.1;
  color: #f0ece2;
  max-width: 700px;
  margin: 0 auto 1rem;
  animation: djFadeUp 0.8s 0.15s ease both;
}

.gold { color: #f0c040; }

.dj-sub {
  font-size: clamp(0.9rem, 1.8vw, 1.1rem);
  color: rgba(240,236,226,0.55);
  max-width: 500px;
  line-height: 1.7;
  animation: djFadeUp 0.8s 0.3s ease both;
}

.dj-actions {
  margin-top: 2.5rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  animation: djFadeUp 0.8s 0.45s ease both;
}

@keyframes djFadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

.dj-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 32px;
  border-radius: 100px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.35s;
  font-family: inherit;
}

.dj-btn-primary {
  background: #f0c040;
  color: #0a0a0f;
}

.dj-btn-primary:hover {
  background: #fff;
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(240,192,64,0.3);
}

.dj-btn-ghost {
  background: transparent;
  color: #f0ece2;
  border: 1px solid rgba(255,255,255,0.15);
}

.dj-btn-ghost:hover {
  border-color: #f0c040;
  color: #f0c040;
}

/* ── 通用 ── */
.dj-section-label {
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #c9a020;
  margin-bottom: 1rem;
}

/* ── 输入区 ── */
.dj-input-section {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
  z-index: 1;
}

.dj-glass-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(12px);
  transition: border-color 0.35s;
}

.dj-glass-card:hover {
  border-color: rgba(240,192,64,0.2);
}

.dj-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}

@media (max-width: 600px) { .dj-form-grid { grid-template-columns: 1fr; } }

.dj-field label {
  display: block;
  font-size: 12px;
  color: rgba(240,236,226,0.55);
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.dj-field select,
.dj-field input {
  width: 100%;
  padding: 11px 36px 11px 14px;
  background: rgba(0,0,0,0.4);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  color: #f0ece2;
  font-size: 15px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.3s;
  -webkit-appearance: none;
  appearance: none;
}

.dj-field select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23c9a020' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  cursor: pointer;
  padding-right: 36px;
}

.dj-field select:focus,
.dj-field input:focus {
  border-color: #f0c040;
}

.dj-gen-btn {
  margin-top: 1.5rem;
  width: 100%;
  padding: 16px;
  border-radius: 100px;
  border: none;
  background: linear-gradient(135deg, #f0c040, #c9a020);
  color: #0a0a0f;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.35s;
  letter-spacing: 1px;
  font-family: inherit;
}

.dj-gen-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 40px rgba(240,192,64,0.35);
}

.dj-gen-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ── 预览区 ── */
.dj-preview-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem 5rem;
  z-index: 1;
  position: relative;
}

.dj-preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.dj-preview-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: #f0ece2;
}

.dj-preview-badge {
  font-size: 12px;
  color: #c9a020;
  border: 1px solid rgba(240,192,64,0.2);
  padding: 4px 14px;
  border-radius: 100px;
  transition: color 0.3s;
}

.dj-preview-body {
  background: rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 2rem;
  min-height: 280px;
  font-size: 15px;
  line-height: 2;
  color: rgba(240,236,226,0.55);
  position: relative;
}

.dj-empty-hint {
  text-align: center;
  padding: 4rem 0;
  color: rgba(240,236,226,0.25);
  font-size: 14px;
  line-height: 2;
}

.dj-loading {
  text-align: center;
  padding: 4rem 0;
  color: #c9a020;
  font-size: 14px;
}

.dj-loading-dots::after {
  content: '';
  animation: djDots 1.4s steps(4,end) infinite;
  display: inline-block;
  width: 20px;
  text-align: left;
}

@keyframes djDots {
  0%  { content: '   '; }
  25% { content: '.  '; }
  50% { content: '.. '; }
  75% { content: '...'; }
}

.dj-chars-block {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(240,192,64,0.04);
  border-radius: 10px;
  border: 1px solid rgba(240,192,64,0.1);
}

.dj-chars-block .label {
  font-size: 12px;
  color: #c9a020;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.dj-chars-block pre {
  white-space: pre-wrap;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.8;
  color: #f0ece2;
}

.dj-episode-block {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.dj-episode-block:last-of-type {
  border-bottom: none;
}

.dj-episode-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.05rem;
  color: #f0c040;
  margin-bottom: 0.6rem;
}

.dj-scene {
  font-size: 12px;
  color: #c9a020;
  margin-bottom: 10px;
}

.dj-body {
  white-space: pre-wrap;
  font-size: 14px;
  line-height: 1.9;
}

.dj-hook {
  display: inline-block;
  margin-top: 0.6rem;
  padding: 4px 12px;
  background: rgba(240,192,64,0.08);
  border-left: 2px solid #f0c040;
  font-size: 13px;
  color: #c9a020;
}

.dj-more-hint {
  text-align: center;
  padding: 1.2rem;
  color: #c9a020;
  font-size: 13px;
}

/* ── 定价区 ── */
.dj-pricing-section {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem 5rem;
  z-index: 1;
}

.dj-pricing-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 0.5rem;
  color: #f0ece2;
}

.dj-pricing-sub {
  text-align: center;
  color: rgba(240,236,226,0.55);
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.dj-pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
}

@media (max-width: 700px) { .dj-pricing-grid { grid-template-columns: 1fr; } }

.dj-price-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 2rem 1.5rem;
  text-align: center;
  transition: all 0.4s;
  position: relative;
  overflow: hidden;
}

.dj-price-card:hover {
  border-color: rgba(240,192,64,0.3);
  transform: translateY(-4px);
}

.dj-price-card.featured {
  border-color: rgba(240,192,64,0.4);
  background: rgba(240,192,64,0.04);
}

.dj-price-card.featured::before {
  content: '最受欢迎';
  position: absolute;
  top: 14px; right: -28px;
  background: #f0c040;
  color: #0a0a0f;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 36px;
  transform: rotate(45deg);
}

.dj-price-name {
  font-size: 13px;
  color: rgba(240,236,226,0.55);
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.dj-price-amount {
  font-family: 'Noto Serif SC', serif;
  font-size: 2.5rem;
  font-weight: 900;
  color: #f0ece2;
}

.dj-price-amount .yen {
  font-size: 1rem;
  vertical-align: super;
  margin-right: 2px;
}

.dj-price-period {
  font-size: 13px;
  color: rgba(240,236,226,0.55);
  margin-top: 4px;
}

.dj-price-features {
  list-style: none;
  margin-top: 1.5rem;
  text-align: left;
  padding: 0;
}

.dj-price-features li {
  padding: 7px 0;
  font-size: 14px;
  color: rgba(240,236,226,0.55);
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.dj-price-features li::before { content: '✓  '; color: #c9a020; }

.dj-price-btn {
  display: block;
  width: 100%;
  margin-top: 1.5rem;
  padding: 11px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
  text-align: center;
  text-decoration: none;
}

.dj-price-btn-ghost {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.15);
  color: #f0ece2;
}

.dj-price-btn-ghost:hover {
  border-color: #f0c040;
  color: #f0c040;
}

.dj-price-btn-primary {
  background: #f0c040;
  border: 1px solid #f0c040;
  color: #0a0a0f;
}

.dj-price-btn-primary:hover {
  background: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(240,192,64,0.25);
}
</style>
