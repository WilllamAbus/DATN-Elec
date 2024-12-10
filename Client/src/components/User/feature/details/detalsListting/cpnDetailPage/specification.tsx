import { Accordion, AccordionItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { ProductVariant } from "../../../../../../services/detailProduct/types/getDetailProduct"; 

interface SpecificationProps {
  variants: ProductVariant[];
}

const Specification: React.FC<SpecificationProps> = ({ variants }) => {
  const firstVariant = variants[0] || {}; 
  const getValue = (value: string | { [key: string]: any } | undefined): string => {
    if (value === undefined || value === null) return 'Chưa cập nhật'; 
    if (typeof value === 'object') {
    
      if (value.name) return value.name;
      return JSON.stringify(value); 
    }
    return value.toString(); 
  };
  
  
  

  return (
    <Accordion selectionMode="multiple" defaultExpandedKeys={["1"]}>
      <AccordionItem key="1" aria-label="Accordion 1" title="Chi tiết cấu hình">
        <Table isStriped aria-label="Example static collection table">
          <TableHeader>
            <TableColumn>Thông tin</TableColumn>
            <TableColumn>Chi tiết</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow key="1">
              <TableCell>Hệ điều hành</TableCell>
              <TableCell>{getValue(firstVariant.operatingSystem)}</TableCell>
            </TableRow>
            <TableRow key="2">
              <TableCell>Chip xử lý (CPU)</TableCell>
              <TableCell>{getValue(firstVariant.cpu)}</TableCell>
            </TableRow>
            <TableRow key="4">
              <TableCell>Chip đồ họa (GPU)</TableCell>
              <TableCell>{getValue(firstVariant.graphicsCard)}</TableCell>
            </TableRow>
            <TableRow key="5">
              <TableCell>RAM</TableCell>
              <TableCell>{getValue(firstVariant.ram)}</TableCell>
            </TableRow>
            <TableRow key="6">
              <TableCell>Dung lượng lưu trữ</TableCell>
              <TableCell>{getValue(firstVariant.storage)}</TableCell>
            </TableRow>
            <TableRow key="7">
              <TableCell>Màn hình</TableCell>
              <TableCell>{getValue(firstVariant.screen)}</TableCell>
            </TableRow>
            <TableRow key="8">
              <TableCell>Dung lượng pin</TableCell>
              <TableCell>{getValue(firstVariant.battery)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </AccordionItem>
    </Accordion>
  );
};

export default Specification;
