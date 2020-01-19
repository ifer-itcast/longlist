# react-virtualized

## 基本使用

1. 安装：yarn add react-virtualized

2. 在项目入口文件 index.js 中导入样式文件

3. 打开文档，点击 [List](https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md) 组件，进入 List 的文档中

4. 翻到文档最底部，将示例代码拷贝到项目中

5. 分析示例代码

## 让 List 组件占满屏幕

1. 打开 AutoSizer 高阶组件的[文档](https://github.com/bvaughn/react-virtualized/blob/master/docs/AutoSizer.md#autosizer)

2. 导入 AutoSizer 组件

3. 通过 render-props 模式，获取到 AutoSizer 组件暴露的 with 和 height 属性

4. 设置 List 组件的 width 和 height 属性

5. 设置城市选择页面根元素高度 100%，让 List 组件占满整个页面

6. 调整样式，让页面不要出现全局滚动条，避免顶部导航栏滚动

```
.citylist 高度 100%
    .navbar 高度 45
    .resize-triggers 高度 100%
```

```css
.citylist {
    height: 100%;
    /* 父 padding-top 能防止子 margin-top 传递 */
    padding-top: 45px;
}
.navbar{
    /* margin 负值会影响底部的元素 */
    margin-top: -45px;
}
```

## 使用 List 组件渲染列表

1. 将获取到的 cityList 和 cityIndex 添加为组件的状态

2. 修改 List 组件的 rowCount 为 cityIndex 数组的长度

3. 将 rowRenderer 函数，添加到组件中，以便在函数中获取到状态数据 cityList 和 cityIndex

4. 修改 List 组件的 rowRenderer 为组件中的 rowRenderer 方法

5. 修改 rowRenderer 方法中渲染的每行结构和样式

6. 修改 List 组件的 rowHeight 为函数，动态计算每一行的高度（每一行高度不一定相同）

## 渲染城市索引列表

1. 封装 renderCityIndex 方法，用来渲染城市索引列表

2. 在方法中，获取到索引数组 cityIndex，遍历 cityIndex，渲染索引列表

3. 将索引 hot 替换为 热

4. 在 state 中添加状态 activeIndex，来指定当前高亮的索引

5. 在遍历 cityIndex 时，添加当前字母索引是否高亮的判断条件

## 滚动城市列表让对应索引高亮

1. 给 List 组件添加 onRowsRendered 配置项，用于获取当前列表渲染的行信息（startIndex）

2. 通过参数 startIndex 获取到，起始行索引（也就是城市列表可视区最顶部一行的索引号）

3. 判断 startIndex 和 activeIndex 是否相同（判断的目的是为了提升性能，避免不必要的 state 更新）

4. 当 startIndex 和 activeIndex 不同时，更新状态 activeIndex 为 startIndex 的值

## 点击索引置顶该索引城市

1. 给索引列表项绑定点击事件

2. 在点击事件中，通过 index 获取到当前项索引号

3. 调用 List 组件的 scrollToRow 方法，让 List 组件滚动到指定行

    3.1 在 constructor 中，调用 React.createRef() 创建 ref 对象
    3.2 将创建好的 ref 对象，添加为 List 组件的 ref 属性
    3.3 通过 ref 的 current 属性，获取到组件实例，再调用组件的 scrollToRow 方法

4. 设置 List 组件的 scrollToAlignment 配置项为 start，保证被点击行出现在页面顶部

5. 对于点击索引无法正确定位的问题，调用 List 组件的 measureAllRows 方法，提前计算高度来解决
