<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const msg = ref('Welcome to my beautiful page!')
watch(msg, (newVal) => {
  console.log(newVal)
})

// 动漫数据
const animeList = ref([
  {
    id: 1,
    title: '进击的巨人 最终季',
    cover: 'https://w.wallhaven.cc/full/2y/wallhaven-2y7qq6.jpg',
    rating: 9.8,
    episodes: 25,
    status: '已完结',
    description: '人类与巨人的史诗对决，最终季震撼开播...',
    genres: ['动作', '剧情', '悬疑'],
    releaseDate: '2024',
  },
  {
    id: 2,
    title: '鬼灭之刃',
    cover: 'https://w.wallhaven.cc/full/2y/wallhaven-2y7qq6.jpg',
    rating: 9.5,
    episodes: 26,
    status: '连载中',
    description: '少年与恶魔的故事...',
    genres: ['动作', '奇幻', '热血'],
  },
  {
    id: 3,
    title: '间谍过家家',
    cover: 'https://w.wallhaven.cc/full/2y/wallhaven-2y7qq6.jpg',
    rating: 9.3,
    episodes: 25,
    status: '连载中',
    description: '特工组建虚假家庭...',
    genres: ['喜剧', '动作', '家庭'],
  },
  {
    id: 4,
    title: '海贼王',
    cover: 'https://w.wallhaven.cc/full/2y/wallhaven-2y7qq6.jpg',
    rating: 9.7,
    episodes: 1000,
    status: '连载中',
    description: '寻找 ONE PIECE 的伟大冒险...',
    genres: ['冒险', '热血', '战斗'],
  },
  {
    id: 5,
    title: '钢之炼金术师',
    cover: 'https://w.wallhaven.cc/full/2y/wallhaven-2y7qq6.jpg',
    rating: 9.6,
    episodes: 64,
    status: '已完结',
    description: '等价交换的炼金术故事...',
    genres: ['奇幻', '动作', '冒险'],
  },
  {
    id: 6,
    title: '死神 千年血战篇',
    cover: 'https://w.wallhaven.cc/full/2y/wallhaven-2y7qq6.jpg',
    rating: 9.4,
    episodes: 52,
    status: '连载中',
    description: '最终篇章，尸魂界的终极之战...',
    genres: ['动作', '奇幻', '战斗'],
  },
])

// 当前选中的分类
const currentCategory = ref('全部')
const categories = ['全部', '热门', '新番', '完结']

// 搜索关键词
const searchQuery = ref('')

// 过滤动漫列表
const filteredAnimeList = computed(() => {
  let result = animeList.value

  // 搜索过滤
  if (searchQuery.value) {
    result = result.filter((anime) =>
      anime.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }

  // 分类过滤
  if (currentCategory.value !== '全部') {
    // 这里可以根据实际需求添加分类逻辑
  }

  return result
})

// 热门动漫数据
const featuredAnime = ref({
  title: '咒术回战',
  cover: 'https://w.wallhaven.cc/full/2y/wallhaven-2y7qq6.jpg',
  rating: 9.9,
  description: '一部讲述着高专学生与诅咒战斗的热血故事...',
})

// 添加新闻数据
const news = ref([
  {
    id: 1,
    title: '《咒术回战》第二季完结篇即将播出',
    date: '2024-03-15',
    image: 'https://w.wallhaven.cc/full/2y/wallhaven-2y7qq6.jpg',
  },
  {
    id: 2,
    title: '《间谍过家家》新作剧场版发布',
    date: '2024-03-10',
    image: 'https://w.wallhaven.cc/full/2y/wallhaven-2y7qq6.jpg',
  },
  {
    id: 3,
    title: '《鬼灭之刃》锻刀村篇开播在即',
    date: '2024-03-08',
    image: 'https://w.wallhaven.cc/full/2y/wallhaven-2y7qq6.jpg',
  },
  {
    id: 4,
    title: '《进击的巨人》最终季完结纪念展',
    date: '2024-03-05',
    image: 'https://w.wallhaven.cc/full/2y/wallhaven-2y7qq6.jpg',
  },
])
</script>

<template>
  <div class="anime-site">
    <!-- 头部导航 -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <h1>Anime<span>World</span></h1>
        </div>
        <nav class="main-nav">
          <a href="#" class="active">首页</a>
          <a href="#">番剧</a>
          <a href="#">排行榜</a>
          <a href="#">时间表</a>
        </nav>
        <div class="header-right">
          <div class="search-bar">
            <input v-model="searchQuery" type="text" placeholder="搜索动漫..." />
            <i class="search-icon">🔍</i>
          </div>
          <button class="login-btn">登录</button>
        </div>
      </div>
    </header>

    <!-- 英雄区域 -->
    <section class="hero" :style="{ backgroundImage: `url(${featuredAnime.cover})` }">
      <div class="hero-content">
        <h2>{{ featuredAnime.title }}</h2>
        <p>{{ featuredAnime.description }}</p>
        <div class="hero-buttons">
          <button class="primary-btn">立即观看</button>
          <button class="secondary-btn">了解更多</button>
        </div>
      </div>
    </section>

    <!-- 分类导航 -->
    <nav class="categories">
      <button v-for="category in categories" :key="category" :class="{ active: currentCategory === category }"
        @click="currentCategory = category">
        {{ category }}
      </button>
    </nav>

    <!-- 最新新闻 -->
    <section class="news-section">
      <div class="section-header">
        <h2>最新资讯</h2>
        <a href="#" class="view-all">查看全部</a>
      </div>
      <div class="news-grid">
        <div v-for="item in news" :key="item.id" class="news-card">
          <img :src="item.image" :alt="item.title" />
          <div class="news-info">
            <span class="news-date">{{ item.date }}</span>
            <h3>{{ item.title }}</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- 动漫列表 -->
    <section class="anime-section">
      <div class="section-header">
        <h2>热门动漫</h2>
        <div class="section-filters">
          <select class="filter-select">
            <option>按评分排序</option>
            <option>最新上线</option>
            <option>最多观看</option>
          </select>
        </div>
      </div>
      <div class="anime-grid">
        <div v-for="anime in filteredAnimeList" :key="anime.id" class="anime-card">
          <div class="anime-cover">
            <img :src="anime.cover" :alt="anime.title" />
            <div class="anime-status">{{ anime.status }}</div>
            <div class="anime-overlay">
              <button class="watch-btn">立即观看</button>
            </div>
          </div>
          <div class="anime-info">
            <h3>{{ anime.title }}</h3>
            <div class="anime-meta">
              <div class="anime-stats">
                <span class="rating">⭐ {{ anime.rating }}</span>
                <span class="episodes">{{ anime.episodes }}集</span>
              </div>
              <div class="anime-genres">
                <span v-for="genre in anime.genres" :key="genre" class="genre-tag">
                  {{ genre }}
                </span>
              </div>
            </div>
            <p class="description">{{ anime.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>关于我们</h3>
          <p>
            AnimeWorld 是您的专业动漫视频网站，致力于为您提供最优质的动漫内容。
          </p>
        </div>
        <div class="footer-section">
          <h3>快速链接</h3>
          <a href="#">关于我们</a>
          <a href="#">使用条款</a>
          <a href="#">隐私政策</a>
          <a href="#">联系我们</a>
        </div>
        <div class="footer-section">
          <h3>关注我们</h3>
          <div class="social-links">
            <a href="#" class="social-link">微博</a>
            <a href="#" class="social-link">微信</a>
            <a href="#" class="social-link">B站</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 AnimeWorld. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* 基础样式 */
.anime-site {
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: 'Noto Sans SC', sans-serif;
}

/* 头部导航样式 */
.header {
  background-color: rgba(255, 255, 255, 0.98);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.logo span {
  color: #3498db;
}

.main-nav {
  display: flex;
  gap: 2rem;
}

.main-nav a {
  color: #2c3e50;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.main-nav a.active,
.main-nav a:hover {
  background: #3498db;
  color: white;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-bar {
  position: relative;
}

.search-bar input {
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border: 2px solid #eee;
  border-radius: 20px;
  width: 200px;
  transition: all 0.3s ease;
}

.search-bar input:focus {
  width: 300px;
  border-color: #3498db;
  outline: none;
}

.search-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.login-btn {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 20px;
  background: #3498db;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
}

.login-btn:hover {
  background: #2980b9;
}

/* 英雄区域样式 */
.hero {
  height: 600px;
  background-size: cover;
  background-position: center;
  position: relative;
  margin-top: 60px;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right,
      rgba(0, 0, 0, 0.8) 0%,
      rgba(0, 0, 0, 0.4) 100%);
}

.hero-content {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  padding: 8rem 2rem;
  color: white;
}

.hero-content h2 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.2rem;
  max-width: 600px;
  margin-bottom: 2rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.primary-btn,
.secondary-btn {
  padding: 1rem 2rem;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-btn {
  background: #3498db;
  color: white;
  border: none;
}

.secondary-btn {
  background: transparent;
  color: white;
  border: 2px solid white;
}

/* 分类导航样式 */
.categories {
  max-width: 1400px;
  margin: 2rem auto;
  padding: 0 2rem;
  display: flex;
  gap: 1rem;
}

.categories button {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 20px;
  background: white;
  color: #2c3e50;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.categories button.active {
  background: #3498db;
  color: white;
}

/* 新闻区域样式 */
.news-section {
  max-width: 1400px;
  margin: 4rem auto;
  padding: 0 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 1.8rem;
  color: #2c3e50;
}

.view-all {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.news-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.news-card:hover {
  transform: translateY(-5px);
}

.news-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.news-info {
  padding: 1.5rem;
}

.news-date {
  color: #666;
  font-size: 0.9rem;
}

.news-info h3 {
  margin: 0.5rem 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

/* 动漫列表区域样式 */
.anime-section {
  max-width: 1400px;
  margin: 4rem auto;
  padding: 0 2rem;
}

.section-filters {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 2px solid #eee;
  border-radius: 10px;
  background: white;
  color: #2c3e50;
}

.anime-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.anime-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.anime-cover {
  position: relative;
  overflow: hidden;
}

.anime-cover img {
  width: 100%;
  height: 380px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.anime-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.anime-card:hover .anime-overlay {
  opacity: 1;
}

.anime-card:hover .anime-cover img {
  transform: scale(1.05);
}

.anime-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(44, 62, 80, 0.9);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
}

.anime-info {
  padding: 1.5rem;
}

.anime-meta {
  margin: 1rem 0;
}

.anime-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.rating {
  color: #f1c40f;
  font-weight: 500;
}

.episodes {
  color: #7f8c8d;
}

.anime-genres {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.genre-tag {
  background: #f0f2f5;
  color: #2c3e50;
  padding: 0.2rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
}

.description {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.watch-btn {
  width: 100%;
  padding: 8px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.watch-btn:hover {
  background: #2980b9;
}

/* 页脚样式 */
.footer {
  background: #2c3e50;
  color: white;
  padding: 4rem 0 2rem;
  margin-top: 6rem;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
}

.footer-section h3 {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.footer-section a {
  color: #bdc3c7;
  text-decoration: none;
  display: block;
  margin-bottom: 0.8rem;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: white;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.footer-bottom {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 3rem;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .hero-content h2 {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .main-nav {
    width: 100%;
    justify-content: center;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .header-right {
    width: 100%;
    justify-content: center;
  }

  .search-bar input:focus {
    width: 100%;
  }

  .hero {
    height: 400px;
  }

  .hero-content {
    padding: 4rem 1rem;
  }

  .hero-content h2 {
    font-size: 2rem;
  }

  .categories {
    overflow-x: auto;
    padding-bottom: 1rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .social-links {
    justify-content: center;
  }
}
</style>
