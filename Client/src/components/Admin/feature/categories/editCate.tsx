import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../../../redux/store";
import {
  fetchCategoryByIdThunk,
  updateCategoryThunk,
} from "../../../../redux/categories/categoriesThunk";
import { getFileFirebase } from "../../../../services/firebase/getFirebse.service"; // Import the function
import "../../../../assets/css/admin.style.css";
import AlertCustomStyles from '../../../../ultils/alert.succes';

const EditCate: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const category = useSelector(
      (state: RootState) => state.categories.selectedCategory
    );
    const [name, setName] = useState("");
    const [path, setPath] = useState("");
    const [img, setImg] = useState<File | null>(null);
    const [imgPreview, setImgPreview] = useState<string | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<'success' | 'error' | null>(null);

    useEffect(() => {
        if (id) {
            dispatch(fetchCategoryByIdThunk(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (category) {
            setName(category.name);
            setPath(category.path);
            if (category.imgURL) {
                getFileFirebase(category.imgURL).then((url) => {
                    setImgPreview(url);
                });
            }
        }
    }, [category]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImg(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id) {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("path", path);
            if (img) {
                formData.append("imgCate", img);
            }
            try {
                await dispatch(updateCategoryThunk({ id, formData }));
                setAlertMessage("Cập nhật thành công!");
                setAlertType('success');
                setTimeout(() => {
                    navigate("/admin/listCategories");
                }, 2000); // Adjust the timeout duration as needed
            } catch (error) {
                setAlertMessage("Failed to update category.");
                setAlertType('error');
            }
        }
    };

    return (
        <main className="w-full flex-grow p-6">
            <div className="flex flex-wrap">
                <div className="w-full mt-6 pl-0 lg:pl-2">
                    {alertMessage && (
                        <AlertCustomStyles
                            message={alertMessage}
                            type={alertType}
                        />
                    )}
                    <div className="leading-loose">
                        <form
                            id="editForm"
                            className="p-10 bg-white rounded shadow-xl"
                            encType="multipart/form-data"
                        >
                            <div className="">
                                <label
                                    className="block text-sm text-gray-600"
                                    htmlFor="cus_name"
                                >
                                    Name
                                </label>
                                <span id="nameCateError" className="error"></span>
                                <input
                                    className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded"
                                    id="cus_name"
                                    name="nameCate"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="">
                                <label
                                    className="block text-sm text-gray-600"
                                    htmlFor="cus_name"
                                >
                                    Path
                                </label>
                                <span id="nameCateError" className="error"></span>
                                <input
                                    className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded"
                                    id="cus_name"
                                    name="path"
                                    type="text"
                                    value={path}
                                    onChange={(e) => setPath(e.target.value)}
                                />
                            </div>
                            <div className="mt-2">
                                <label
                                    className="block text-sm text-gray-600"
                                    htmlFor="cus_img"
                                >
                                    Hình
                                </label>
                                <span id="cateImgError" className="error"></span>
                                <input
                                    className="w-full px-5 py-4 text-gray-700 bg-gray-200 rounded"
                                    type="file"
                                    id="cus_img"
                                    name="imgCate"
                                    onChange={handleImageChange}
                                />
                                {imgPreview && (
                                    <div className="image-preview">
                                        <img src={imgPreview} alt="Image Preview" />
                                    </div>
                                )}
                            </div>
                            <div className="mt-6 flex gap-2">
                                <button
                                    id="editButton"
                                    className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded"
                                    onClick={handleSubmit}
                                >
                                    Cập nhật
                                </button>
                                <button
                                    className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded"
                                    type="button"
                                >
                                    <a href="/admin/listCategories">Danh sách</a>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default EditCate;
