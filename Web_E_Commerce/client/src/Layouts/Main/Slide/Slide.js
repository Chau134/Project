import 'react-slideshow-image/dist/styles.css';

import classNames from 'classnames/bind';
import styles from './Slide.module.scss';

import Slider from "react-slick";

import imgBanner from './img/imgBanner1.png';
import imgBanner1 from './img/imgBanner2.png';
import imgBanner2 from './img/imgBanner3.png';
const cx = classNames.bind(styles);

function SlideWeb() {

    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows : false,
        autoplay: true
      };

    return (
        <div className={cx('slide-container')}>
          <Slider {...settings}>
            <div>
                <img id={cx('test')} src={imgBanner}/>
            </div>
            <div>
                <img id={cx('test')} src={imgBanner1}/>
            </div>
            <div>
                <img id={cx('test')} src={imgBanner2}/>
            </div>
        </Slider>
        </div>
    );
}

export default SlideWeb;
