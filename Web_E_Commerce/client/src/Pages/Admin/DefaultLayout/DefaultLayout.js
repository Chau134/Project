import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';

import HomePage from '../Layouts/HomePageAdmin/HomePageAdmin';
import SlideBar from '../Layouts/SlideBar/SlideBar';
import { useState } from 'react';
const cx = classNames.bind(styles);

function DefaultLayout() {
    const [activeList, setActiveList] = useState('dash');

    return (
        <div className={cx('wrapper')}>
            <div className={cx('main')}>
                <div className={cx('slide-bar')}>
                    <SlideBar setActiveList={setActiveList} />
                </div>
                <div className={cx('home-page')}>
                    <HomePage activeList={activeList} />
                </div>
            </div>
        </div>
    );
}

export default DefaultLayout;
