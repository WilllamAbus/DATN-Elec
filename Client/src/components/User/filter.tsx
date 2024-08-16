import React , {  useState, ChangeEvent, FormEvent } from "react";
// import { useNavigate } from 'react-router-dom';


const Filter :React.FC = () => {
    const [selectedPrices, setSelectedPrice] = useState<string>("");
  const [error, setError] = useState<string>('');

  const handleSub = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
   
      if (selectedPrices.length > 0) {
        setError('');
          window.location.href=(`/filter/${selectedPrices}`);
      } else {
          setError('Vui lòng chọn ít nhất một khoảng giá');
      }
  };

  const handleCheckPrice = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedPrice(e.target.value);
    setError(''); 
  };
    return (
      <>
      <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">
                Giá
            </h3>
            <form onSubmit={handleSub}>
                <div className="space-y-2">
                    <div className="flex items-center">
                        <input
                            type="radio"
                            name="price"
                            value="price-0"
                            id="brand-1"
                            className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                            onChange={handleCheckPrice}
                        />
                        <label className="text-gray-600 ml-3 cursor-pointer" htmlFor="brand-1">
                            Dưới 500.000 VNĐ
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="radio"
                            name="price"
                            value="price-1"
                            id="brand-2"
                            className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                            onChange={handleCheckPrice}
                        />
                        <label className="text-gray-600 ml-3 cursor-pointer" htmlFor="brand-2">
                            500.000 VNĐ - 1.000.000 VNĐ
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="radio"
                            name="price"
                            value="price-2"
                            id="brand-3"
                            className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                            onChange={handleCheckPrice}
                        />
                        <label className="text-gray-600 ml-3 cursor-pointer" htmlFor="brand-3">
                            1.000.000 VNĐ - 3.000.000 VNĐ
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="radio"
                            name="price"
                            value="price-3"
                            id="brand-4"
                            className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                            onChange={handleCheckPrice}
                        />
                        <label className="text-gray-600 ml-3 cursor-pointer" htmlFor="brand-4">
                            3.000.000 VNĐ - 5.000.000 VNĐ
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="radio"
                            name="price"
                            value="price-4"
                            id="brand-5"
                            className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                            onChange={handleCheckPrice}
                        />
                        <label className="text-gray-600 ml-3 cursor-pointer" htmlFor="brand-5">
                            Trên 5.000.000 VNĐ
                        </label>
                    </div>
                </div>
                <br />
                <button type="submit" className="block w-full py-1 text-center text-white bg-primary">
                    Lọc
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
      </>
    );
}

export default Filter;
