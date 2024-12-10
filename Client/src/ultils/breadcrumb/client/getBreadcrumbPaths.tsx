interface BreadcrumbPath {
  label: string;
  link?: string; 
}

export const getBreadcrumbPaths = (
  category?: string,
  productName?: string
): BreadcrumbPath[] => {
  const paths: BreadcrumbPath[] = [
    { label: "Trang chủ", link: "/" },
  ];

  if (category) {
    paths.push({ label: category, link: `/category/${category}` });
  }

  if (productName) {
    paths.push({ label: productName });
  }

  return paths;
};
