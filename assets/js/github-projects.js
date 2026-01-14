/**
 * GitHub Projects Loader
 * 获取并展示 SmallasWater 的 GitHub 项目
 * 支持 localStorage 缓存
 */

(function() {
    'use strict';

    var GITHUB_USERNAME = 'SmallasWater';
    var API_URL = 'https://api.github.com/users/' + GITHUB_USERNAME + '/repos';
    var CONTAINER_ID = 'github-projects';
    var CACHE_KEY = 'github_projects_cache';
    var CACHE_DURATION = 60 * 60 * 1000; // 缓存时间：1小时（毫秒）

    // 语言颜色映射
    var LANGUAGE_COLORS = {
        'Java': '#b07219',
        'JavaScript': '#f1e05a',
        'TypeScript': '#3178c6',
        'Python': '#3572A5',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'PHP': '#4F5D95',
        'C++': '#f34b7d',
        'C': '#555555',
        'C#': '#178600',
        'Go': '#00ADD8',
        'Rust': '#dea584',
        'Shell': '#89e051',
        'Kotlin': '#A97BFF',
        'Vue': '#41b883',
        'default': '#8b8b8b'
    };

    // 获取缓存
    function getCache() {
        try {
            var cached = localStorage.getItem(CACHE_KEY);
            if (!cached) return null;

            var data = JSON.parse(cached);
            var now = new Date().getTime();

            // 检查缓存是否过期
            if (now - data.timestamp > CACHE_DURATION) {
                localStorage.removeItem(CACHE_KEY);
                return null;
            }

            return data.repos;
        } catch (e) {
            console.warn('读取缓存失败:', e);
            return null;
        }
    }

    // 设置缓存
    function setCache(repos) {
        try {
            var data = {
                timestamp: new Date().getTime(),
                repos: repos
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('缓存保存失败:', e);
        }
    }

    // 格式化数字 (1000 -> 1k)
    function formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }

    // 格式化日期
    function formatDate(dateString) {
        var date = new Date(dateString);
        var now = new Date();
        var diff = now - date;
        var days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days < 1) return '今天';
        if (days < 7) return days + ' 天前';
        if (days < 30) return Math.floor(days / 7) + ' 周前';
        if (days < 365) return Math.floor(days / 30) + ' 个月前';
        return Math.floor(days / 365) + ' 年前';
    }

    // 获取语言颜色
    function getLanguageColor(language) {
        return LANGUAGE_COLORS[language] || LANGUAGE_COLORS['default'];
    }

    // 创建项目卡片 HTML
    function createProjectCard(repo) {
        var languageColor = getLanguageColor(repo.language);
        var languageHtml = repo.language
            ? '<span class="project-language">' +
                  '<span class="language-dot" style="background-color: ' + languageColor + '"></span>' +
                  repo.language +
              '</span>'
            : '';

        return '<div class="project-card">' +
            '<div class="project-card__inner">' +
                '<div class="project-card__header">' +
                    '<svg class="project-card__icon" viewBox="0 0 16 16" width="16" height="16">' +
                        '<path fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" fill="currentColor"></path>' +
                    '</svg>' +
                    '<a href="' + repo.html_url + '" target="_blank" rel="noopener noreferrer" class="project-card__title">' +
                        repo.name +
                    '</a>' +
                '</div>' +
                '<p class="project-card__desc">' + (repo.description || '暂无描述') + '</p>' +
                '<div class="project-card__meta">' +
                    languageHtml +
                    '<span class="project-card__stat">' +
                        '<svg viewBox="0 0 16 16" width="14" height="14">' +
                            '<path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" fill="currentColor"></path>' +
                        '</svg>' +
                        formatNumber(repo.stargazers_count) +
                    '</span>' +
                    '<span class="project-card__stat">' +
                        '<svg viewBox="0 0 16 16" width="14" height="14">' +
                            '<path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" fill="currentColor"></path>' +
                        '</svg>' +
                        formatNumber(repo.forks_count) +
                    '</span>' +
                    '<span class="project-card__update">更新于 ' + formatDate(repo.pushed_at) + '</span>' +
                '</div>' +
            '</div>' +
        '</div>';
    }

    // 创建错误信息 HTML
    function createErrorHtml(message) {
        return '<div class="project-error" style="text-align: center; padding: 2rem;">' +
            '<p style="color: #ff6b6b;">' + message + '</p>' +
            '<button onclick="window.loadGitHubProjects(true)" class="btn" style="margin-top: 1rem;">重试</button>' +
        '</div>';
    }

    // 渲染项目
    function renderProjects(repos, container) {
        // 过滤掉 fork 的仓库，并按 star 数排序
        var filteredRepos = repos
            .filter(function(repo) { return !repo.fork; })
            .sort(function(a, b) { return b.stargazers_count - a.stargazers_count; })
            .slice(0, 12);

        if (filteredRepos.length === 0) {
            container.innerHTML = createErrorHtml('暂无项目');
            return;
        }

        // 渲染项目卡片
        var html = '';
        for (var i = 0; i < filteredRepos.length; i++) {
            html += createProjectCard(filteredRepos[i]);
        }
        container.innerHTML = html;
    }

    // 加载 GitHub 项目
    function loadGitHubProjects(forceRefresh) {
        var container = document.getElementById(CONTAINER_ID);
        if (!container) return;

        // 尝试从缓存获取
        if (!forceRefresh) {
            var cachedRepos = getCache();
            if (cachedRepos) {
                console.log('使用缓存的 GitHub 项目数据');
                renderProjects(cachedRepos, container);
                return;
            }
        }

        // 显示加载状态
        container.innerHTML = '<div class="loading-placeholder">' +
            '<p>正在加载项目...</p>' +
        '</div>';

        // 从 API 获取数据
        $.ajax({
            url: API_URL + '?sort=updated&per_page=30',
            method: 'GET',
            dataType: 'json',
            success: function(repos) {
                // 保存到缓存
                setCache(repos);
                console.log('已缓存 GitHub 项目数据');

                renderProjects(repos, container);
            },
            error: function(xhr, status, error) {
                console.error('加载 GitHub 项目失败:', error);

                // 尝试使用过期的缓存作为后备
                var expiredCache = null;
                try {
                    var cached = localStorage.getItem(CACHE_KEY);
                    if (cached) {
                        expiredCache = JSON.parse(cached).repos;
                    }
                } catch (e) {}

                if (expiredCache) {
                    console.log('使用过期缓存作为后备');
                    renderProjects(expiredCache, container);
                } else {
                    container.innerHTML = createErrorHtml('加载失败，请稍后重试');
                }
            }
        });
    }

    // 暴露到全局
    window.loadGitHubProjects = loadGitHubProjects;

    // DOM 加载完成后执行
    $(document).ready(function() {
        loadGitHubProjects(false);
    });

})();
