import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.less';

import Waterfall from '../components/waterfall/index';

function IndexPage() {

    return (
        <div className="normal">
            <Waterfall>
            	<img src="./resources/img/2.jpg"/>
            	<img src="./resources/img/3.jpg"/>
            	<img src="./resources/img/4.jpg"/>
            	<img src="./resources/img/5.jpg"/>
            	<img src="./resources/img/6.jpg"/>
            	<img src="./resources/img/7.jpg"/>
            	<img src="./resources/img/8.jpg"/>
            	<img src="./resources/img/9.jpg"/>
            	<img src="./resources/img/2.jpg"/>
            	<img src="./resources/img/3.jpg"/>
            	<img src="./resources/img/4.jpg"/>
            	<img src="./resources/img/5.jpg"/>
            	<img src="./resources/img/6.jpg"/>
            	<img src="./resources/img/7.jpg"/>
            	<img src="./resources/img/8.jpg"/>
            	<img src="./resources/img/9.jpg"/>
            	<img src="./resources/img/2.jpg"/>
            	<img src="./resources/img/3.jpg"/>
            	<img src="./resources/img/4.jpg"/>
            	<img src="./resources/img/5.jpg"/>
            	<img src="./resources/img/6.jpg"/>
            	<img src="./resources/img/7.jpg"/>
            	<img src="./resources/img/8.jpg"/>
            	<img src="./resources/img/9.jpg"/>
            	<img src="./resources/img/2.jpg"/>
            	<img src="./resources/img/3.jpg"/>
            	<img src="./resources/img/4.jpg"/>
            	<img src="./resources/img/5.jpg"/>
            	<img src="./resources/img/6.jpg"/>
            	<img src="./resources/img/7.jpg"/>
            	<img src="./resources/img/8.jpg"/>
            	<img src="./resources/img/9.jpg"/>
            </Waterfall>
        </div>
    );
}

export default connect()(IndexPage);
