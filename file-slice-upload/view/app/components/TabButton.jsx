import React, { Component } from 'react';

export default class TabButton extends Component {
  state = {
    defaultActiveKey: this.props.defaultActiveKey ? this.props.defaultActiveKey : '',
  }
  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultActiveKey !== this.state.defaultActiveKey) {
      this.setState({
        defaultActiveKey: nextProps.defaultActiveKey,
      });
    }
  }
  handleClick = (item, index) => {
    if (this.props.onChange &&
      typeof this.props.onChange === 'function'
      && item.key !== this.state.defaultActiveKey) {
      this.props.onChange(item.key ? item.key : index);
    }
    this.setState({
      defaultActiveKey: item.key,
    });
  }
  widthFilter = (item) => {
    if (item.width) return item.width;
    else if (this.props.width) return this.props.width;
    return '80px';
  }
  colorFilterTrue = (item) => {
    if (item.key === this.state.defaultActiveKey) return '#fff';
    return (this.props.color);
  }
  colorFilterFalse = (item) => {
    if (item.key === this.state.defaultActiveKey) return '#fff';
    return '#787878';
  }
  bgColorFilterTrue = (item) => {
    if (item.key === this.state.defaultActiveKey) return this.props.color;
    return 'rgba(255,255,255, 0)';
  }
  bgColorFilterFalse = (item) => {
    if (item.key === this.state.defaultActiveKey) return '#787878';
    return 'rgba(255,255,255, 0)';
  }
  // tabs: 按钮数组[{text: '', key: '', width: ''}](text:文字，key:回调函数返回的Key值(若无返回Index)，width:当前tab宽度)
  // height: tabs高度，默认为20px
  // onChange: 点击tab回调函数，必须为function, 若当前点击对象无key值则返回index索引。
  // width: tab宽度，若有，所有tab的宽度均为此宽度，默认为80px，宽度读取优先级，tabsWidth > 全局width > default
  // color: tabs颜色，默认为#787878
  // fontSize: tabs字体大小，默认为14px
  render() {
    const {
      tabs,
      styles,
    } = this.props;
    return (
      <div style={styles}>
        {tabs.map((item, index) => (
          <span
            onClick={() => this.handleClick(item, index)}
            key={`tab${index + 1}`}
            style={{
              display: 'inline-block',
              minWidth: this.widthFilter(item),
              height: this.props.height ? this.props.height : '22px',
              lineHeight: this.props.height ? this.props.height : '22px',
              fontSize: this.props.fontSize ? this.props.fontSize : '14px',
              color: this.props.color ? this.colorFilterTrue(item) :
                this.colorFilterFalse(item),
              backgroundColor: this.props.color ? this.bgColorFilterTrue(item) :
                this.bgColorFilterFalse(item),
              textAlign: 'center',
              fontFamily: 'PingHeiLight',
              borderLeft: index === 0 ? '1px solid' : '',
              borderRight: '1px solid',
              borderTop: '1px solid',
              borderBottom: '1px solid',
              borderColor: this.props.color ? this.props.color : '#787878',
              cursor: 'pointer',
              borderTopLeftRadius: index === 0 ? '5px' : '',
              borderBottomLeftRadius: index === 0 ? '5px' : '',
              borderTopRightRadius: index === tabs.length - 1 ? '5px' : '',
              borderBottomRightRadius: index === tabs.length - 1 ? '5px' : '',
            }}
          >
            {item.text}
          </span>
        ))
        }
      </div>
    );
  }
}

