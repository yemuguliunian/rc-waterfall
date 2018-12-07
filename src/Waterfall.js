/**
 * 瀑布流（宽相同，高度不同）
 * 设计思想（PC，APP）
 * PC : 定宽不定列
 * APP : 定列不定宽
 * athor : ywx
 * createTime : 2018/12/6
 */
import React from 'react';
import PropTypes from 'prop-types';
import './Waterfall.less';

import Animate from 'rc-animate';
import LazyLoad from 'react-lazy-load';
import debounce from 'lodash/debounce';
import max from 'lodash/max';
import Immutable from 'immutable';

import { PC, APP } from './CalculateType';

class Waterfall extends React.Component {

	static defaultProps = {
        prefixCls : 'rc-waterfall',
        defaultCol : 2, // 几列
 		width : 200, // 列宽
 		gutter : 16, // 间隔
 		calculateType : PC,
 		lazy : false // 懒加载
    }

    constructor(props) {
        super(props);

        this.state = {
            col : props.defaultCol,
            width : props.width,
            containerInnerWidth : 0,
            containerInnerHeight : 0
        };

        this.refsArray = [];
    }

    componentDidMount() {
        this.setCol();
        this.debouncedResize = debounce(() => {
            this.setCol();
        }, 250);
        this.resizeEvent = window.addEventListener('resize', this.debouncedResize);
    }

    // 设置列
    setCol = () => {
    	let _t = this;
        const containerW = this.getRef('container').offsetWidth;
        const { width, gutter, calculateType } = this.props;
        // PC
        if(calculateType === PC) {
        	if(!'width' in _t.props) {
        		throw new Error(`When Type of calculate is ${PC}，the props of [with] is required`);
        	}
        	let actualCol = parseInt(containerW/(width + gutter));
        	this.setState({
	            col : actualCol,
	            containerInnerWidth : actualCol*width + (actualCol - 1)*gutter
	        }, () => {
	        	_t.initColHeight();
	        	_t.calculateLayout();
	        }) 
        }
        // APP
        if(calculateType === APP) {
        	if(!'defaultCol' in _t.props) {
        		throw new Error(`When Type of calculate is ${APP}，the props of [defaultCol] is required`);
        	}
        	const { defaultCol } = this.props;
        	let colWidth = (containerW - (defaultCol-1)*gutter)/defaultCol;
        	this.setState({
	            col : defaultCol,
	            width : colWidth,
	            containerInnerWidth : containerW
	        }, () => {
	        	_t.initColHeight();
	        	_t.calculateLayout();
	        }) 
        }
    }

    // 布局
    calculateLayout = () => {
    	const _t = this;
    	const { gutter } = _t.props;
    	const { width } = _t.state;
    	this.refsArray.map((ref, index) => {
    		// 这边延时处理是为了防止获取不到clientHeight
            this.winDelayTimer = setTimeout(() => {
                let childHeight = ref.clientHeight;
                let minIndex = 0,
                    minColHeight = _t.colHeight[0];
                _t.colHeight.map((item, index) => {
                    if(item < minColHeight) {
                        minColHeight = item;
                        minIndex = index;
                    }
                })
                ref.style.left =  `${ minIndex*width + (minIndex == 0 ? 0 : gutter*(minIndex))}px`;
                ref.style.top = `${minColHeight}px`;
                // 上次保存的高度 + child高度 + 间隔
                _t.colHeight[minIndex] = minColHeight + childHeight + gutter;
                if(index === _t.refsArray.length - 1) {
                	_t.setState({
                		containerInnerHeight : max(_t.colHeight)
                	})
                }
            }, 200);
	    })
    }

    
    // 初始化每列的高度
    initColHeight = () => {
    	const { col } = this.state;
    	this.colHeight = [];
    	for(let i = 0; i < col; i++) {
    		this.colHeight[i] = 0;
    	}
    }

    renderChildren = () => {
    	let _t = this;
    	let children = this.props.children;
    	if(React.Children.count(children) === 0) {
    		return children;
    	}
    	// 渲染子组件时，重置refsArray
    	if(_t.refsArray.length > 0) {
    		_t.refsArray = [];
    	}
    	return React.Children.map(children, (child, i) => {
			return _t.cloneElement(child);
		})
    }

    // 拷贝
    cloneElement = (child, i) => {
    	let _t = this;
        const { gutter, lazy } = _t.props;
      	const { width } = _t.state;
    	let children = React.cloneElement(child, {
    		name : i,
	      	style : {
	      		width : width,
	      		left : 0,
                position : 'absolute',
                transition : 'top 1s ease, left 1s ease'
	      	},
	      	ref : (ref => {
	      		if(!!ref) {
	      			_t.refsArray.push(ref); 
	      		}
	      	})
	    })

	    // 懒加载预留
	    if(lazy) {
	    	const lazyProps = {
				...lazy
			};
	    	children = <LazyLoad {...lazyProps}>{children}</LazyLoad>
	    }

    	// 加载动画预留
    	return children = (
    		<Animate
    			component=""
		        showProp="visible"
		        transitionAppear
    			transitionName="fade"
    		>
    			{children}
    		</Animate>
		)

	    // 预览图片功能预留
    }

    getRef = (name) => {
        return this[name];
    }

    saveRef = (name) => {
        return (node) => {
            if (node) {
                this[name] = node;
            }
        };
    }

	render() {
		const _t = this;
		const { prefixCls, width, gutter, lazy } = this.props;
        const { col, containerInnerWidth, containerInnerHeight } = this.state;

        let waterfallStyle = {};
        if(containerInnerWidth) {
            waterfallStyle = {
                display: 'block',
                width: containerInnerWidth,
                height : containerInnerHeight
            }
        }

		return (
			<div
				className={prefixCls} 
				ref={this.saveRef('container')}
			>
				<div 
					className={`${prefixCls}-inner`} 
	                style={waterfallStyle}
	            >
					{this.renderChildren()}
				</div>
			</div>
		)
	}

	componentWillUnmount() {
        this.resizeEvent = window.removeEventListener('resize', this.debouncedResize);
    }
}

Waterfall.propTypes = {
    defaultCol : PropTypes.number,
    width : PropTypes.number,
    gutter : PropTypes.number,
    calculateType : PropTypes.oneOf([PC, APP])
}

export default Waterfall;