const $ = mdui.$
let CTX
const configKey = "fileBrowserConfig";
const defaultConfig = {
    theme: 'auto',
    primary: 'teal',
    accent: 'teal',
}

/**
 * 入口
 */
$(function main() {
    CTX = new FileBrowserContext()

    initTheme(loadConfig())
    initTitle()
    initPathList()
    initFileDetail()

    registerSearchFileEvent()
})

/**
 * 初始化标题
 */
function initTitle() {
    const title = CTX.chain.map(fileCtx => fileCtx.name).join(" > ")
    $('.m-appbar-title').text(title)
}

/**
 * 初始化左边的index列表
 */
function initPathList() {
    let $pathList = $('.m-list-index');
    CTX.chain.forEach((fileContext, i) => {
        const active = i === CTX.chain.length - 1
        const item = genPathListItem(fileContext, active)
        $pathList.append(item)
    })
}

/**
 * 生成路径列表项
 */
function genPathListItem(fileContext, active) {
    const stateClass = active ? 'mdui-list-item-active' : ''
    return $(`<div class="mdui-list-item mdui-ripple ${stateClass}">
                <a href="${fileContext.href + window.location.search}">
                    <i class="mdui-list-item-icon mdui-icon material-icons mdui-text-color-theme">${fileContext.icon}</i>
                    <span class="mdui-list-item-content mdui-text-color-theme">${fileContext.name}</span>
                </a>
            </div>`)
}

/**
 * 生成文件详情
 */
function initFileDetail() {
    const folders = []
    const files = []
    CTX.files.forEach(fileContext => {
        if (fileContext.isDir) {
            folders.push(genFileDetailItem(fileContext))
        } else {
            files.push(genFileDetailItem(fileContext))
        }
    })

    let $mFileDetail = $(`.m-file-detail`);
    if (folders.length > 0) {
        $mFileDetail.append(genFileDetailItemDivideLine('Folders'))
        folders.forEach(item => $mFileDetail.append(item))
    }
    if (files.length > 0) {
        $mFileDetail.append(genFileDetailItemDivideLine('Files'))
        files.forEach(item => $mFileDetail.append(item))
    }
}

/**
 * 生成文件详情项
 */
function genFileDetailItem(fileContext) {
    return $(`<div class="mdui-list-item mdui-ripple"  data-file-name="${fileContext.name}">
                <a class="mdui-list-item-avatar mdui-icon material-icons mdui-color-theme" href="${fileContext.href}" >${fileContext.icon}</a>
                <a class="mdui-list-item-content" href="${fileContext.href}">
                    <div class="mdui-list-item-title">${fileContext.name}</div>
                    <div class="mdui-list-item-text">${fileContext.date || ''}</div>
                </a>
                <span class="mdui-text-color-theme" style="padding-right: 24px">${fileContext.size || ''}</span>
                <button class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-text-color-theme-text mdui-ripple" 
                    mdui-tooltip="{content: 'copy'}" 
                    onclick="copyText('${fileContext.href}')">
                    <i class="mdui-icon material-icons">content_copy</i>
                </button>
            </div>`)
}

/**
 * 生成文件详情项分割线
 */
function genFileDetailItemDivideLine(text) {
    return $(`<div class="mdui-subheader-inset">${text}</div>`)
}

/**
 * 文件搜索事件
 */
function registerSearchFileEvent() {
    const $benSearch = $('.m-file-search')
    $benSearch.on('input', () => {
        const keyword = $benSearch.val() || ""
        $(`.m-file-detail > .mdui-list-item`).removeClass('mdui-hidden')
        if (keyword.length > 0) {
            $(`.m-file-detail > .mdui-list-item:not([data-file-name*='${keyword}'])`).addClass('mdui-hidden')
        }
    })
}

/**
 * 复制字符
 */
function copyText(text) {
    navigator.clipboard.writeText(text).then(() => mdui.snackbar({message: 'copy url to clipboard'}));
}

/**
 * 初始主题
 */
function initTheme(themeConfig) {
    themeConfig = themeConfig || defaultConfig
    console.log("设置主题：", themeConfig)
    let $body = $('body');
    $body.removeClass()
    $body.addClass(`mdui-theme-primary-${themeConfig.primary} mdui-theme-accent-${themeConfig.accent}  mdui-theme-layout-${themeConfig.theme}`)

    $(`.m-theme-theme input[value=${themeConfig.theme}]`).attr('checked', true)
    $(`.m-theme-primary input[value=${themeConfig.primary}]`).attr('checked', true)
    $(`.m-theme-accent input[value=${themeConfig.accent}]`).attr('checked', true)
}

/**
 * 重置主题
 */
function resetTheme() {
    setConfig()
    initTheme()
}

/**
 * 手动设置主题
 */
function changeTheme() {
    const themeConfig = {
        theme: $('.m-theme-theme input:checked').val(),
        primary: $('.m-theme-primary input:checked').val(),
        accent: $('.m-theme-accent input:checked').val()
    }
    setConfig(themeConfig)
    initTheme(themeConfig)
}

/**
 * 载入配置
 */
function loadConfig() {
    const config = localStorage.getItem(configKey)
    console.log(config);
    if (config != null) {
        return JSON.parse(config)
    }
    return defaultConfig
}

/**
 * 设置配置
 */
function setConfig(themeConfig) {
    localStorage.setItem(configKey, JSON.stringify(themeConfig))
}