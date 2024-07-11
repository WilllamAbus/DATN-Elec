import React from 'react';
import bannerImage from '../../assets/images/banner-bg.png'; // Adjust path to your banner image
const Banner :React.FC = () => {
    return (
        <div className="bg-cover bg-no-repeat bg-center py-36"  style={{ backgroundImage: `url(${bannerImage})` }}>
            <div className="container">
                <h1 className="text-6xl text-gray-800 font-small mb-4 capitalize">
                    Bộ sưu tập Thiết bị số <br /> thiết yếu
                </h1>
                {/* <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aperiam <br />
                    accusantium perspiciatis, sapiente magni eos dolorum ex quos dolores odio
                </p> */}
                <div className="mt-12">
                    <a href="#" className="bg-primary  text-white px-8 py-3 font-medium rounded-md hover:bg-transparent hover:text-primary">
                        Mua ngay
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Banner;
