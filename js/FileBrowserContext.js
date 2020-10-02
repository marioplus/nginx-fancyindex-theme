/**
 * 公共类属性兼容
 * pc
 * chrome   72
 * edge     19
 * firefox  69
 * safari   60
 * android
 * webview  72
 * chrome   72
 * firefox  x
 * ios
 * safari   14
 */
class FileBrowserContext {
    root = new FileContext('home', '/download/', 'home', true)
    chain = []
    files = []

    constructor() {
        let pathStr = $('#m-index-path').text().trim()

        // 计算chain
        while (pathStr.length > 0) {
            if (pathStr === this.root.href) {
                this.chain.push(this.root)
                pathStr = ''
                continue
            }

            const lastIndexOf = pathStr.substr(0, pathStr.length - 1).lastIndexOf("/")
            const name = pathStr.slice(lastIndexOf + 1, -1)
            const href = pathStr
            this.chain.push(FileContext.ofDir(name, href))
            pathStr = pathStr.substr(0, lastIndexOf + 1)
        }
        this.chain = this.chain.reverse()

        // 计算files
        $('#m-index-path + table#list > tbody > tr').each((i, e) => {

            const linkElement = e.querySelector('a')
            const size = e.querySelector('td.size').textContent
            const date = e.querySelector('td.date').textContent

            let fileContext
            if (date === '-') {
                if (linkElement.href.length <= (window.location.origin + this.root.href).length + 1) {
                    return
                }
                fileContext = FileContext.ofGoBack('Parent', linkElement.href)
            } else if (size === '-') {
                fileContext = FileContext.ofDir(linkElement.textContent, linkElement.href, false, date)
            } else {
                fileContext = FileContext.ofFile(linkElement.textContent, linkElement.href, size, date)
            }
            this.files.push(fileContext)
        })
    }
}

class FileContext {
    name;
    href;
    icon;
    goBack;
    isDir;
    size;
    date;

    constructor(name, href, icon, isDir, goBack, size, date) {
        this.name = name
        this.goBack = goBack
        this.isDir = isDir
        this.size = size
        this.date = date
        this.href = href

        if (icon) {
            this.icon = icon
        } else {
            if (goBack) {
                // 上级
                this.icon = 'arrow_back'
            } else if (isDir) {
                // 文件夹
                this.icon = 'folder'
            } else {
                // 文件
                this.icon = 'description'
            }
        }
    }

    static ofFile(name, href, size, date) {
        return new FileContext(name, href, undefined, false, false, size, date)
    }

    static ofDir(name, href, goBack, date) {
        return new FileContext(name, href, undefined, true, goBack, undefined, date)
    }

    static ofGoBack(name, href) {
        return new FileContext(name, href, undefined, true, true, undefined, undefined)
    }
}