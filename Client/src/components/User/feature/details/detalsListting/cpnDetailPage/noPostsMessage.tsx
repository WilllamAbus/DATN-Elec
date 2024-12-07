const noPostsMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4 text-center text-gray-500">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/no-product%2Fblog%20(1).png?alt=media&token=8e5a9fd1-c486-488b-87c1-5aba8db51453"
        alt="No products"
        className="w-32 h-32 mb-4"
      />
      <p className="text-gray-400">
        Oops! Hiện tại chưa có bài viết nào. Bạn quay lại sau nhé!
      </p>
    </div>
  );
};

export default noPostsMessage;
