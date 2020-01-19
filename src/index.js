import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { NavBar, Icon } from 'antd-mobile';
import 'react-virtualized/styles.css';
import './index.scss';
import { getCurrentCity } from './utils';
import { List, AutoSizer } from 'react-virtualized';

// 索引 A、B 的高度
const TITLE_HEIGHT = 36;
// 每个城市名称的高度
const NAME_HEIGHT = 50;

// 格式化城市列表
const formatCityData = list => {
	const cityList = {};
	list.forEach(item => {
		const first = item.short.substr(0, 1);
		if (cityList[first]) {
			// 有
			cityList[first].push(item);
		} else {
			// 无
			cityList[first] = [item];
		}
	});
	const cityIndex = Object.keys(cityList).sort();
	return {
		cityList,
		cityIndex
	};
};

const formatCityIndex = letter => {
	switch (letter) {
		case '#':
			return '当前定位';
		case 'hot':
			return '热门城市';
		default:
			return letter.toUpperCase();
	}
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cityList: {},
            cityIndex: [],
            activeIndex: 0 // 右侧索引列表高亮的索引号
        };
        // 创建 ref 对象
        this.cityListComponent = React.createRef();
    }
	
	async getCityList() {
		// 城市列表
		const res = await axios.get('http://localhost:8080/area/city?level=1');
		const { cityList, cityIndex } = formatCityData(res.data.body);

		// 热门城市
		const hotRes = await axios.get('http://localhost:8080/area/hot');
		cityList['hot'] = hotRes.data.body;
		cityIndex.unshift('hot');

		// 当前定位城市
		const curCity = await getCurrentCity();
		cityList['#'] = [curCity];
		cityIndex.unshift('#');

		this.setState({
			cityList,
			cityIndex
		});
	};
	async componentDidMount() {
        await this.getCityList();
        // 解决 scrollToRow 定位不精确的问题
        // 调用 measureAllRows，提前计算 List 中每一行的高度，实现 scrollToRow 的精确跳转
        // 调用下面方法的时候需要保证 List 组件中已经有数据了！如果 List 组件中的数据为空，就会导致调用该方法报错！
        this.cityListComponent.current.measureAllRows();
	}
	rowRenderer = ({
		key, // Unique key within array of rows
		index, // 索引号
		isScrolling, // 当前项是否正在滚动中
		isVisible, // 当前项在 List 中是可见的
		style // 给每一行添加样式，作用：指定每一行的位置
	}) => {
		const { cityIndex, cityList } = this.state;
		const letter = cityIndex[index]; // 首字母
		// 获取指定字母下的城市数据 cityList[letter]
		return (
			<div key={key} style={style} className="city">
				<div className="title">
					{formatCityIndex(letter)}
				</div>
				{cityList[letter].map(item =>
					<div className="name" key={item.value}>
						{item.label}
					</div>
				)}
			</div>
		);
	};
	getRowHeight = ({ index }) => {
		// 索引标题高度 + 城市数量 * 城市名称的高度
		// TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
		const { cityList, cityIndex } = this.state;
		return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT;
	};
	// 渲染右侧索引列表
	renderCityIndex = () => {
		const { cityIndex, activeIndex } = this.state;
		return cityIndex.map((item, index) =>
			<li className="city-index-item" key={item} onClick={() => {
                // scrollToRow 不精确
                this.cityListComponent.current.scrollToRow(index);
            }}>
				<span className={activeIndex === index ? 'index-active' : ''}>
					{item === 'hot' ? '热' : item.toUpperCase()}
				</span>
			</li>
		);
	};
	// 用于获取 List 组件中渲染行的信息
	onRowsRendered = ({ startIndex }) => {
		if (this.state.activeIndex !== startIndex) {
			this.setState({
				activeIndex: startIndex
			});
		}
	};
	render() {
		return (
			<div className="citylist">
				<NavBar
					className="navbar"
					mode="light"
					icon={<Icon type="left" />}
					onLeftClick={() => console.log('onLeftClick')}
				>
					城市选择
				</NavBar>
				<AutoSizer>
					{({ width, height }) =>
						<List
                            ref={this.cityListComponent}
							width={width}
							height={height}
							rowCount={this.state.cityIndex.length}
							rowHeight={this.getRowHeight}
							rowRenderer={this.rowRenderer}
							onRowsRendered={this.onRowsRendered}
                            scrollToAlignment="start"
						/>}
				</AutoSizer>

				<ul className="city-index">
					{this.renderCityIndex()}
				</ul>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.querySelector('#root'));
